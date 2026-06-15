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
import {OutputContainer} from './outputContainer';
import {Channel} from '../../channel/channel';
import {OutputFormat} from '../format/outputFormat';
import {OutputSwitcherImpl} from '../switcher/outputSwitcherImpl';
import {OutputSwitcher} from '../switcher/outputSwitcher';
import {TextFormat} from '../format/text/textFormat';
import {DataTablesFormat} from '../format/dataTables/dataTablesFormat';
import {uPlotFormat} from '../format/uPlot/uPlotFormat';
import {InterpreterErrorListener} from '../../interpreterErrorListener/interpreterErrorListener';
import {InterpreterErrorListenerImpl} from '../../interpreterErrorListener/interpreterErrorListenerImpl';
import {AngularFormat} from '../format/angular/angularFormat';
import {AngularObjectCollection} from '../../angularObjectCollection/angularObjectCollection';
import {HTMLFormat} from '../format/html/htmlFormat';
import {OutputPlugin} from '../plugins/outputPlugin';
import {ResponseChannel} from '../../responseChannel/responseChannel';
import {ResponseChannelImpl} from '../../responseChannel/responseChannelImpl';
import {ParagraphOutputMessageImpl} from '../messages/paragraphOutputMessage/paragraphOutputMessageImpl';
import {OutputPluginStub} from '../plugins/outputPluginStub';
import {OutputType} from '../outputType';
import {ParagraphMessageImpl} from '../../paragraphCollection/messages/paragraphMessage/paragraphMessageImpl';
import {SafeJsonImpl} from '../../safeJson/safeJsonImpl';

export class OutputContainerImpl implements OutputContainer{
  private readonly _channel:Channel;
  private readonly _outputFormats:OutputFormat[];
  private readonly _outputSwitcher:OutputSwitcher;
  private readonly _errorListener: InterpreterErrorListener;
  private readonly _responseChannel: ResponseChannel;
  private readonly _outputPluginStub: OutputPlugin;
  private _outputPlugin:OutputPlugin;

  constructor(channel:Channel, angularObjectCollection: AngularObjectCollection) {
    this._channel = channel;
    this._outputFormats = [
      new DataTablesFormat(this),
      new uPlotFormat(),
      new TextFormat(),
      new AngularFormat(this, angularObjectCollection),
      new HTMLFormat()
    ];
    this._outputPluginStub = new OutputPluginStub();
    this._outputPlugin = this._outputPluginStub;
    this._responseChannel = new ResponseChannelImpl();
    this._responseChannel.subscribe('PARAGRAPH', (json:object) => this.updateOutputOnParagraphMessage(json));
    this._responseChannel.subscribe('PARAGRAPH_OUTPUT', (json:object)=> this.updateOutputOnParagraphOutputMessage(json));
    this._outputSwitcher = new OutputSwitcherImpl(this);
    this._errorListener = new InterpreterErrorListenerImpl(this);
  }

  private updateOutputOnParagraphMessage(json:object):void {
    const paragraphMessage = new ParagraphMessageImpl(json);
    const safeParagraphData = new SafeJsonImpl(paragraphMessage.paragraphData());
    if(!safeParagraphData.propertyExists('output')){
      this._outputPlugin = this._outputPluginStub;
    }
  }

  private updateOutputOnParagraphOutputMessage(json:object):void {
    const paragraphOutputMessage = new ParagraphOutputMessageImpl(json);
    if(!this._outputSwitcher.outputTypeIsValid(paragraphOutputMessage.type())){
      this._outputSwitcher.requestFormatSwitch(this._outputSwitcher.activeButton());
      return;
    }
    if(!this._outputPlugin.isStub() && paragraphOutputMessage.type() === OutputType.dataTables && this._outputPlugin.outputType() === OutputType.dataTables){
      this._outputPlugin.response(paragraphOutputMessage.output());
    }
    else{
      this._outputPlugin = this.pluginFromFormats(paragraphOutputMessage.type(), paragraphOutputMessage.output());
    }
    this._outputSwitcher.response(json);
  }

  private pluginFromFormats(type:string, outputData:object): OutputPlugin {
    return this._outputFormats.find(outputFormat => outputFormat.outputType() === type).plugin(outputData);
  }

  outputPlugin(): OutputPlugin {
    return this._outputPlugin;
  }

  errorListener(): InterpreterErrorListener {
    return this._errorListener;
  }

  outputSwitcher(): OutputSwitcher {
    return this._outputSwitcher;
  }

  outputFormats(): OutputFormat[] {
    return this._outputFormats;
  }

  request(data: object): void {
    this._channel.request(data);
  }

  response(json: object): void {
    this._responseChannel.response(json);
    this._errorListener.response(json);
  }
}
