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
import {OutputSwitcherButton} from '../../switcher/button/outputSwitcherButton';
import {Channel} from '../../../channel/channel';
import {Request} from '../../../channel/request';
import {DataTableSwitcherButton} from './switcherButton/dataTablesSwitcherButton';
import {OutputFormat} from '../outputFormat';
import {OutputType} from '../../outputType';
import {DataTablesPluginImpl} from '../../plugins/dataTablesPlugin/dataTablesPluginImpl';
import {SafeJsonImpl} from '../../../safeJson/safeJsonImpl';
import { OutputPlugin } from '../../plugins/outputPlugin';

export class DataTablesFormat implements OutputFormat, Request {
  private readonly _channel: Channel;
  private readonly _outputType: string;
  private readonly _switcherButtons: OutputSwitcherButton[];

  constructor(channel: Channel) {
    this._channel = channel;
    this._outputType = OutputType.dataTables;
    this._switcherButtons = [
      new DataTableSwitcherButton()
    ];
  }

  plugin(paragraphOutputData: object): OutputPlugin {
    const safeParagraphOutputData = new SafeJsonImpl(paragraphOutputData);
    const outputData:object = safeParagraphOutputData.getProperty('data', 'object');
    const outputOptions:object = safeParagraphOutputData.getProperty('options', 'object');
    return new DataTablesPluginImpl(this._channel, outputData, outputOptions);
  }

  outputType(): string {
    return this._outputType;
  }

  request(data: object): void {
    this._channel.request(data);
  }

  switcherButtons(): OutputSwitcherButton[] {
    return this._switcherButtons;
  }
}
