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
import {OutputSwitcherButton} from './button/outputSwitcherButton';
import {OutputSwitcher} from './outputSwitcher';
import {MessageDTO} from '../../message/messageDTO';
import {ParagraphOutputDTO} from '../../message/paragraphOutputMessage/paragraphOutputDTO';
import {ParagraphOutputMessageImpl} from '../../message/paragraphOutputMessage/paragraphOutputMessageImpl';
import {OutputSwitcherButtonStub} from './button/outputSwitcherButtonStub';
import {PushValue} from '../../pushValue/pushValue';

export class OutputSwitcherImpl implements OutputSwitcher {
  private readonly _channel: Channel;
  private readonly _outputFormats:Channel[];
  private _activeButton: OutputSwitcherButton;
  private isLoading: boolean;
  private isSwitchable: boolean;
  private _pushIsSwitchable: PushValue<boolean>[];
  private _pushIsLoading: PushValue<boolean>[];

  constructor(channel: Channel, outputFormats: Channel[]) {
    this._channel = channel;
    this._outputFormats = outputFormats;
    this._activeButton = new OutputSwitcherButtonStub();
    this.isLoading = false;
    this.isSwitchable = false;
    this._pushIsSwitchable = [];
    this._pushIsLoading = [];
  }

  switchFormat(outputSwitcherButton: OutputSwitcherButton): void {
    this._activeButton = outputSwitcherButton;
    this.request(outputSwitcherButton.requestData());
  }

  pushIsSwitchable(value: PushValue<boolean>): void {
    value.update(this.isSwitchable);
    this._pushIsSwitchable.push(value);
  }

  pushIsLoading(value: PushValue<boolean>): void {
    value.update(this.isLoading);
    this._pushIsLoading.push(value);
  }

  request(data: object): void {
    const message = data as MessageDTO<unknown>;
    const op = message.op;
    if(op === 'PARAGRAPH_OUTPUT_REQUEST') {
      this.isLoading = true;
      this._pushIsLoading.forEach(value => value.update(this.isLoading));
    }
    this._channel.request(data);
  }

  response(data: object): void {
    const message = data as MessageDTO<unknown>;
    const op = message.op;
    if(op === 'PARAGRAPH_OUTPUT'){
      const paragraphOutputMessage = new ParagraphOutputMessageImpl(message.data as ParagraphOutputDTO);
      const output = paragraphOutputMessage.toOutput();
      if(output.isStub() || this._activeButton.isStub()) {
        this._outputFormats.forEach(format => format.response(message));
        this._activeButton = new OutputSwitcherButtonStub();
      }
      else{
        if(output.type() === this._activeButton.outputType()){
          this._outputFormats.forEach(format => format.response(message));
        }
        else {
          this._channel.request(this._activeButton.requestData());
        }
      }
      this.isLoading = false;
      this._pushIsLoading.forEach(value => value.update(this.isLoading));
      let isSwitchable = false;
      if(!output.isStub()) {
        isSwitchable = output.isAggregated();
      }
      this.isSwitchable = isSwitchable;
      this._pushIsSwitchable.forEach(value => value.update(this.isSwitchable));
    }
  }
}
