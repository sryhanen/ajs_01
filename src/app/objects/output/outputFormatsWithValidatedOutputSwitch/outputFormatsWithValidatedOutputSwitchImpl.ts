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
import {Channel} from '../../channel/channel';
import {OutputFormat} from '../format/outputFormat';
import {computed, Signal} from '@angular/core';
import {RenderNode} from '../../rendering/renderNode/renderNode';
import {DataTablesFormat} from '../format/dataTables/dataTablesFormat';
import {HTMLFormat} from '../format/html/htmlFormat';
import {uPlotFormat} from '../format/uPlot/uPlotFormat';
import {TextFormat} from '../format/text/textFormat';
import {AngularFormat} from '../format/angular/angularFormat';
import {OutputSwitcherImpl} from '../switcher/outputSwitcherImpl';
import {OutputSwitcher} from '../switcher/outputSwitcher';
import {SafeJsonImpl} from '../../safeJson/safeJsonImpl';
import {MessageImpl} from '../../message/messageImpl';
import {ParagraphOutputRequest} from './paragraphOutputRequest/paragraphOutputRequest';
import {ParagraphOutputRequestImpl} from './paragraphOutputRequest/paragraphOutputRequestImpl';
import {ParagraphOutputMessageImpl} from '../paragraphOutputMessage/paragraphOutputMessageImpl';
import {ParagraphOutputRequestStub} from './paragraphOutputRequest/paragraphOutputRequestStub';
import {ComponentViewStub} from '../../rendering/componentView/componentViewStub';
import {ComponentView} from '../../rendering/componentView/componentView';
import {OutputFormatsWithValidatedOutputSwitch} from './outputFormatsWithValidatedOutputSwitch';

export class OutputFormatsWithValidatedOutputSwitchImpl implements OutputFormatsWithValidatedOutputSwitch {
  private readonly _channel: Channel;
  private readonly _outputFormats: OutputFormat[];
  private readonly _outputSwitcher:OutputSwitcher;
  private _previousParagraphOutputRequest: ParagraphOutputRequest;
  private readonly _componentView:ComponentView;

  constructor(channel: Channel, ) {
    this._channel = channel;
    this._outputFormats = [
      new DataTablesFormat(this),
      new HTMLFormat(this),
      new uPlotFormat(this),
      new TextFormat(this),
      new AngularFormat(this),
    ];
    const buttons = this._outputFormats.map(format => format.switcherButtons());
    this._outputSwitcher = new OutputSwitcherImpl(buttons.flat());
    this._previousParagraphOutputRequest = new ParagraphOutputRequestStub();
    this._componentView = new ComponentViewStub();
  }

  print(): Signal<RenderNode> {
    return computed(() => ({
      componentView: this._componentView,
      children: computed(() => {
        const renderableList: RenderNode[] = [
          this._outputSwitcher.print()()
        ];
        this._outputFormats.forEach(outputFormat => {
          renderableList.push(outputFormat.print()());
        });
        return renderableList;
      }),
    }));
  }

  request(json: object) {
    const message = new MessageImpl(new SafeJsonImpl(json));
    if(message.operation() === 'PARAGRAPH_OUTPUT_REQUEST'){
      this._previousParagraphOutputRequest = new ParagraphOutputRequestImpl(message);
    }
    this._channel.request(json);
  }

  response(json: object): void {
    const message = new MessageImpl(new SafeJsonImpl(json));
    if(message.operation() === 'PARAGRAPH_OUTPUT'){
      const paragraphOutputMessage = new ParagraphOutputMessageImpl(message);
      if(!this._previousParagraphOutputRequest.isStub() && paragraphOutputMessage.outputType() !== this._previousParagraphOutputRequest.type()){
        this._channel.request(this._previousParagraphOutputRequest.request());
        return;
      }
      this._outputFormats.forEach(format => format.response(json));
      this._outputSwitcher.response(json);
    }
  }
}
