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
import {computed, Signal} from '@angular/core';
import {RenderNode} from '../rendering/renderNode/renderNode';
import {Channel} from '../channel/channel';
import {OutputFormat} from './format/outputFormat';
import {OutputSwitcher} from './switcher/outputSwitcher';
import {ComponentView} from '../rendering/componentView/componentView';
import {InterpreterErrorListener} from '../interpreterErrorListener/interpreterErrorListener';
import {InterpreterErrorListenerImpl} from '../interpreterErrorListener/interpreterErrorListenerImpl';
import {ComponentViewImpl} from '../rendering/componentView/componentViewImpl';
import {OutputView} from '../../ui/angular2+/output/outputView';
import {OutputSwitcherImpl} from './switcher/outputSwitcherImpl';
import {DataTablesFormatImpl} from './format/dataTables/dataTablesFormatImpl';
import {HTMLFormat} from './format/html/htmlFormat';
import {UPlotFormatImpl} from './format/uPlot/uPlotFormatImpl';
import {TextFormat} from './format/text/textFormat';
import {AngularFormatImpl} from './format/angular/angularFormatImpl';
import {ResponseRegister} from '../register/responseRegister/responseRegister';
import {ResponseRegisterImpl} from '../register/responseRegister/responseRegisterImpl';
import {MessageImpl} from '../message/messageImpl';
import {SafeJsonImpl} from '../safeJson/safeJsonImpl';
import {ParagraphOutputMessageImpl} from '../message/paragraphOutputMessage/paragraphOutputMessageImpl';
import {ParagraphOutputRequestImpl} from '../requests/paragraphOutput/paragraphOutputRequestImpl';
import {ParagraphOutputRequestStub} from '../requests/paragraphOutput/paragraphOutputRequestStub';
import {ParagraphOutputRequest} from '../requests/paragraphOutput/paragraphOutputRequest';

export class OutputImpl implements Output {
  private readonly _channel: Channel;
  private readonly _outputFormats: OutputFormat[];
  private readonly _outputSwitcher:OutputSwitcher;
  private _previousParagraphOutputRequest: ParagraphOutputRequest;
  private readonly _interpreterErrorListener:InterpreterErrorListener;
  private readonly _componentView:ComponentView;
  private readonly _responseRegister: ResponseRegister;

  constructor(channel:Channel) {
    this._channel = channel;
    this._outputFormats = [
      new DataTablesFormatImpl(this),
      new HTMLFormat(),
      new UPlotFormatImpl(this),
      new TextFormat(),
      new AngularFormatImpl(this),
    ];
    const buttons = this._outputFormats.map(format => format.switcherButtons());
    this._outputSwitcher = new OutputSwitcherImpl(buttons.flat());
    this._previousParagraphOutputRequest = new ParagraphOutputRequestStub();
    this._interpreterErrorListener = new InterpreterErrorListenerImpl();
    this._componentView = new ComponentViewImpl(OutputView, computed(() => ({
      outputSwitcher: this._outputSwitcher.print()().componentView,
      outputFormats: this._outputFormats
        .filter(outputFormat => !outputFormat.print()().componentView.isStub())
        .map(outputFormat => outputFormat.print()().componentView),
      interpreterError: this._interpreterErrorListener.print()().componentView
    })));
    this._responseRegister = new ResponseRegisterImpl();
    this._responseRegister.register('PARAGRAPH_OUTPUT', (json) => this.paragraphOutputResponse(json));
  }

  print(): Signal<RenderNode> {
    return computed(() =>
      ({
        componentView: this._componentView
      })
    );
  }

  request(json: object): void {
    const message = new MessageImpl(new SafeJsonImpl(json));
    if(message.operation() === 'PARAGRAPH_OUTPUT_REQUEST'){
      this._previousParagraphOutputRequest = new ParagraphOutputRequestImpl(message);
      this._outputSwitcher.request(json);
    }
    this._channel.request(json);
  }

  response(json: object): void {
    this._interpreterErrorListener.response(json);
    this._responseRegister.response(json);
  }

  private paragraphOutputResponse(json: object): void {
    const paragraphOutputMessage = new ParagraphOutputMessageImpl(new MessageImpl(new SafeJsonImpl(json)));
    if(!this._previousParagraphOutputRequest.isStub() && paragraphOutputMessage.type() !== this._previousParagraphOutputRequest.type()){
      this._channel.request(this._previousParagraphOutputRequest.request());
      return;
    }
    this._outputFormats.forEach(format => format.response(json));
    this._outputSwitcher.response(json);
  }
}
