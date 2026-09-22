/*
 * Teragrep User Interface (ajs_01)
 * Copyright (C) 2019-2026 Suomen Kanuuna Oy
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 *
 * Additional permission under GNU Affero General Public License version 3
 * section 7
 *
 * If you modify this Program, or any covered work, by linking or combining it
 * with other code, such other code is not for that reason alone subject to any
 * of the requirements of the GNU Affero GPL version 3 as long as this Program
 * is the same Program as licensed from Suomen Kanuuna Oy without any additional
 * modifications.
 *
 * Supplemented terms under GNU Affero General Public License version 3
 * section 7
 *
 * Origin of the software must be attributed to Suomen Kanuuna Oy. Any modified
 * versions must be marked as "Modified version of" The Program.
 *
 * Names of the licensors and authors may not be used for publicity purposes.
 *
 * No rights are granted for use of trade names, trademarks, or service marks
 * which are in The Program if any.
 *
 * Licensee must indemnify licensors and authors for any liability that these
 * contractual assumptions impose on licensors and authors.
 *
 * To the extent this program is licensed as part of the Commercial versions of
 * Teragrep, the applicable Commercial License may apply to this file if you as
 * a licensee so wish it.
 */
import {Output} from './output';
import {computed, signal, Signal, WritableSignal} from '@angular/core';
import {RenderNode} from '../rendering/renderNode/renderNode';
import {Channel} from '../channel/channel';
import {InterpreterErrorListenerImpl} from '../interpreterErrorListener/interpreterErrorListenerImpl';
import {InterpreterErrorListener} from '../interpreterErrorListener/interpreterErrorListener';
import {OutputFormat} from './format/outputFormat';
import {OutputSwitcher} from './switcher/outputSwitcher';
import {ParagraphOutputRequest} from './paragraphOutputRequest/paragraphOutputRequest';
import {DataTablesFormatImpl} from './format/dataTables/dataTablesFormatImpl';
import {HTMLFormat} from './format/html/htmlFormat';
import {UPlotFormatImpl} from './format/uPlot/uPlotFormatImpl';
import {TextFormat} from './format/text/textFormat';
import {AngularFormatImpl} from './format/angular/angularFormatImpl';
import {OutputSwitcherImpl} from './switcher/outputSwitcherImpl';
import {ParagraphOutputRequestStub} from './paragraphOutputRequest/paragraphOutputRequestStub';
import {MessageImpl} from '../message/messageImpl';
import {WebSocketPayloadImpl} from '../safeJson/webSocketPayloadImpl';
import {ParagraphOutputRequestImpl} from './paragraphOutputRequest/paragraphOutputRequestImpl';
import {ParagraphOutputMessageImpl} from '../message/paragraphOutputMessage/paragraphOutputMessageImpl';
import {RenderNodeImpl} from '../rendering/renderNode/renderNodeImpl';
import {RegisteredComponents} from '../../ui/angular2+/componentRegistry/registeredComponents';
import {OutputType} from './outputType';
import {RenderNodeStub} from '../rendering/renderNode/renderNodeStub';
import {OutputPayload} from './outputPayload';

export class OutputImpl implements Output {
  private readonly _channel:Channel;
  private readonly _interpreterErrorListener:InterpreterErrorListener;
  private readonly _outputFormats: Map<string, OutputFormat<unknown>>;
  private readonly _outputSwitcher:OutputSwitcher;
  private _previousParagraphOutputRequest: ParagraphOutputRequest;
  private readonly _renderNode: Signal<RenderNode>;
  private readonly _outputStub:RenderNode;
  private readonly _currentOutput:WritableSignal<RenderNode>;

  constructor(channel:Channel) {
    this._channel = channel;
    this._interpreterErrorListener = new InterpreterErrorListenerImpl();
    const outputFormats:[string, OutputFormat<unknown>][] = [
      [OutputType.dataTables, new DataTablesFormatImpl(this)],
      [OutputType.html, new HTMLFormat()],
      [OutputType.uPlot, new UPlotFormatImpl(this)],
      [OutputType.text, new TextFormat()],
      [OutputType.angular, new AngularFormatImpl(this)]
    ];
    this._outputFormats = new Map(outputFormats);
    const buttons = Array.from(this._outputFormats.values()).map(format => format.switcherButtons());
    this._outputSwitcher = new OutputSwitcherImpl(buttons.flat());
    this._previousParagraphOutputRequest = new ParagraphOutputRequestStub();
    this._outputStub = new RenderNodeStub();
    this._currentOutput = signal(this._outputStub);
    this._renderNode = signal(new RenderNodeImpl(RegisteredComponents.OUTPUT_VIEW, computed(() => ({
      interpreterErrorListener: this._interpreterErrorListener.print()(),
      outputSwitcher: this._outputSwitcher.print()(),
      output: this._currentOutput()
    }))));
  }

  render(data:OutputPayload<unknown>): void {
    const outputToRender = this._outputFormats.get(data.type);
    outputToRender.render(data);
    this._currentOutput.set(outputToRender.print()());
  }

  print(): Signal<RenderNode> {
    return this._renderNode;
  }

  request(json: object) {
    const message = new MessageImpl(new WebSocketPayloadImpl(json));
    if(message.operation() === 'PARAGRAPH_OUTPUT_REQUEST'){
      this._previousParagraphOutputRequest = new ParagraphOutputRequestImpl(message);
      this._outputSwitcher.render(true, true);
    }
    this._channel.request(json);
  }

  response(json: object): void {
    const message = new MessageImpl(new WebSocketPayloadImpl(json));
    if(message.operation() === 'PARAGRAPH_OUTPUT'){
      const paragraphOutputMessage = new ParagraphOutputMessageImpl(message);
      const receivedOutputType = message.dataAsWebSocketPayload().objectPropertyAsPayload('output').stringProperty('type');
      if(!this._previousParagraphOutputRequest.isStub() && receivedOutputType !== this._previousParagraphOutputRequest.type()){
        this._channel.request(this._previousParagraphOutputRequest.request());
      }
      else{
        this._outputSwitcher.response(json);
        paragraphOutputMessage.renderOutput(this);
      }
    }
  }
}
