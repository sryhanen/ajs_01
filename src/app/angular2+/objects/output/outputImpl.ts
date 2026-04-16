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
import {OutputDTO} from './outputDTO';
import {DataTablesPluginStub} from './plugins/dataTablesPlugin/dataTablesPluginStub';
import {OutputType} from './outputType';
import {Channel} from '../channel/channel';
import {DataTablesPluginImpl} from './plugins/dataTablesPlugin/dataTablesPluginImpl';
import {DataTablesOutputData} from './plugins/dataTablesPlugin/dataTablesOutputData';
import {DataTablesOutputOptions} from './plugins/dataTablesPlugin/dataTablesOutputOptions';
import {TextPluginStub} from './plugins/textPlugin/textPluginStub';
import {TextPluginImpl} from './plugins/textPlugin/textPluginImpl';
import {uPlotOutputData} from './plugins/uPlotPlugin/uPlotOutputData';
import {uPlotOutputOptions} from './plugins/uPlotPlugin/uPlotOutputOptions';
import {uPlotPluginImpl} from './plugins/uPlotPlugin/uPlotPluginImpl';
import {uPlotPluginStub} from './plugins/uPlotPlugin/uPlotPluginStub';
import {OutputPlugin} from './plugins/outputPlugin';
import {DataTablesPlugin} from './plugins/dataTablesPlugin/dataTablesPlugin';
import {AngularPluginImpl} from './plugins/angularPlugin/angularPluginImpl';
import {AngularPluginStub} from './plugins/angularPlugin/angularPluginStub';
import {AngularPlugin} from './plugins/angularPlugin/angularPlugin';

export class OutputImpl implements Output {
  private readonly _data: OutputDTO<unknown>;

  constructor(data:OutputDTO<unknown>) {
    this._data = data;
  }

  type(): string {
    return this._data.type;
  }

  isAggregated(): boolean {
    return this._data.isAggregated !== undefined && this._data.isAggregated;
  }

  toAngularPlugin(channel:Channel): AngularPlugin {
    let angularPlugin:AngularPlugin;
    if(this._data.type === OutputType.angular){
      angularPlugin = new AngularPluginImpl(channel, this._data.data as string);
    }
    else{
      angularPlugin = new AngularPluginStub();
    }
    return angularPlugin;
  }

  toDataTablesPlugin(channel:Channel): DataTablesPlugin {
    let tablesPlugin: DataTablesPlugin;
    if(this._data.type === OutputType.dataTables) {
      const data = this._data as OutputDTO<DataTablesOutputData, DataTablesOutputOptions>;
      tablesPlugin = new DataTablesPluginImpl(channel, data);
    }
    else{
      tablesPlugin = new DataTablesPluginStub();
    }
    return tablesPlugin;
  }

  toTextPlugin(): OutputPlugin {
    let textPlugin: OutputPlugin;
    if(this._data.type === OutputType.text) {
      const data = this._data as OutputDTO<string>;
      textPlugin = new TextPluginImpl(data);
    }
    else{
      textPlugin = new TextPluginStub();
    }
    return textPlugin;
  }

  touPlotPlugin(): OutputPlugin {
    let microPlotPlugin: OutputPlugin;
    if(this._data.type === OutputType.uPlot) {
      const data = this._data as OutputDTO<uPlotOutputData, uPlotOutputOptions>;
      microPlotPlugin = new uPlotPluginImpl(data);
    }
    else{
      microPlotPlugin = new uPlotPluginStub();
    }
    return microPlotPlugin;
  }

  isStub(): boolean {
    return false;
  }
}
