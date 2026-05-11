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
import {SafeJson} from '../../../../safeJson/safeJson';
import {PushValue} from '../../../../pushValue/pushValue';
import {OutputSwitcherButton} from '../../../switcher/button/outputSwitcherButton';
import {PushValueImpl} from '../../../../pushValue/pushValueImpl';
import {OutputType} from '../../../outputType';

export class ParagraphOutputResponse implements Channel{
  private readonly _channel:Channel;
  private readonly _outputFormats:OutputFormat[];
  private readonly _outputSwitcher:OutputSwitcher;
  private readonly _activeButton: PushValue<OutputSwitcherButton>;

  constructor(channel:Channel, outputFormats:OutputFormat[], outputSwitcher:OutputSwitcher) {
    this._channel = channel;
    this._outputFormats = outputFormats;
    this._outputSwitcher = outputSwitcher;
    this._activeButton = new PushValueImpl();
    this._outputSwitcher.activeButton(this._activeButton);
  }

  request(data: object) {
    this._channel.request(data);
  }

  response(data: object): void {
    const message = new MessageImpl(new SafeJsonImpl(data));
    if(message.operation() === 'PARAGRAPH_OUTPUT'){
      this._outputSwitcher.response(data);
      const paragraphOutputData = new SafeJsonImpl(message.data());
      if(this.shouldSwitch(paragraphOutputData)){
        this._channel.request(this._activeButton.value().requestData());
      }
      else{
        if(!paragraphOutputData.propertyExists('output')){
          this._outputFormats.forEach(outputFormat => outputFormat.clear());
        }
        else{
          const outputData:object = paragraphOutputData.getProperty('output', 'object');
          const safeOutputData = new SafeJsonImpl(outputData);
          const outputType:string = safeOutputData.getProperty('type', 'string');
          const outputFormatToRender = this._outputFormats.find(outputFormat => outputFormat.outputType() === outputType);
          if(outputType === OutputType.dataTables){
            this._outputFormats.forEach(format => {
              if(format.outputType() !== OutputType.dataTables){
                format.clear();
              }
            });
            outputFormatToRender.render(outputData);
          }
          else {
            this._outputFormats.forEach(format => format.clear());
            outputFormatToRender.render(outputData);
          }
        }
      }
    }
  }

  private shouldSwitch(paragraphOutputData:SafeJson): boolean {
    const output = new SafeJsonImpl(paragraphOutputData.getProperty('output', 'object'));
    let shouldSwitch = false;
    const outputType:string = output.getProperty('type', 'string');
    if(!this._activeButton.value().isStub()){
      const activeButton = this._activeButton.value();
      shouldSwitch = outputType !== activeButton.outputType();
    }
    return shouldSwitch;
  }
}
