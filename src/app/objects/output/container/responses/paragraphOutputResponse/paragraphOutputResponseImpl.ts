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
import {OutputFormat} from '../../../format/outputFormat';
import {Channel} from '../../../../channel/channel';
import {OutputSwitcher} from '../../../switcher/outputSwitcher';
import {SafeJsonImpl} from '../../../../safeJson/safeJsonImpl';
import {MessageImpl} from '../../../../message/messageImpl';
import {OutputType} from '../../../outputType';
import {OutputPlugin} from '../../../plugins/outputPlugin';
import {WritableSignal} from '@angular/core';

export class ParagraphOutputResponseImpl implements Channel {
  private readonly _channel:Channel;
  private readonly _outputFormats:OutputFormat[];
  private readonly _outputSwitcher:OutputSwitcher;
  private readonly _outputPlugin:WritableSignal<OutputPlugin>;

  constructor(channel:Channel, outputFormats:OutputFormat[], outputSwitcher:OutputSwitcher, outputPlugin:WritableSignal<OutputPlugin>) {
    this._channel = channel;
    this._outputFormats = outputFormats;
    this._outputSwitcher = outputSwitcher;
    this._outputPlugin = outputPlugin;
  }

  request(data: object) {
    this._channel.request(data);
  }

  response(data: object): void {
    const message = new MessageImpl(new SafeJsonImpl(data));
    if(message.operation() === 'PARAGRAPH_OUTPUT'){
      const paragraphOutputData = new SafeJsonImpl(message.data());
      const outputData:object = paragraphOutputData.getProperty('output', 'object');
      const safeOutputData = new SafeJsonImpl(outputData);
      const outputType:string = safeOutputData.getProperty('type', 'string');
      if(!this._outputSwitcher.outputTypeIsValid(outputType)){
        this._outputSwitcher.requestFormatSwitch(this._outputSwitcher.activeButton());
      }
      else {
        const outputFormatToRender = this._outputFormats.find(outputFormat => outputFormat.outputType() === outputType);
        const newPlugin = outputFormatToRender.plugin(outputData);
        if(!this._outputPlugin().isStub() && this._outputPlugin().outputType() === OutputType.dataTables && outputFormatToRender.outputType() === OutputType.dataTables){
          this._outputPlugin().response(safeOutputData.getProperty('data', 'object'));
        }
        else{
          this._outputPlugin.set(newPlugin);
        }
        this._outputSwitcher.response(data);
      }
    }
  }
}
