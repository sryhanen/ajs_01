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
import {DataTablesView} from '../../../../components/output/plugins/dataTablesView/dataTablesView';
import {DataTablesPluginStub} from '../../plugins/dataTablesPlugin/dataTablesPluginStub';
import {OutputFormat} from '../outputFormat';
import {ContainerRef} from '../../../containerRef/containerRef';
import {DataTablesPlugin} from '../../plugins/dataTablesPlugin/dataTablesPlugin';
import {OutputType} from '../../outputType';
import {DataTablesPluginImpl} from "../../plugins/dataTablesPlugin/dataTablesPluginImpl";

export class DataTablesFormat implements OutputFormat, Request{
  private readonly _channel: Channel;
  private readonly _outputType: string;
  private readonly _switcherButtons: OutputSwitcherButton[];
  private readonly _viewComponent: new () => DataTablesView;
  private readonly _pluginStub:DataTablesPlugin;
  private _plugin: DataTablesPlugin;
  private readonly _containerRefs: ContainerRef[];

  constructor(channel: Channel) {
    this._channel = channel;
    this._outputType = OutputType.dataTables;
    this._pluginStub = new DataTablesPluginStub();
    this._plugin = this._pluginStub;
    this._switcherButtons = [
      new DataTableSwitcherButton()
    ];
    this._viewComponent = DataTablesView;
    this._containerRefs = [];
  }

  pushContainerRef(value:ContainerRef): void {
    this._containerRefs.push(value);
    if(!this._plugin.isStub()){
      value.createComponent(this._viewComponent, [{name:'plugin', value: this._plugin}]);
    }
  }

  outputType(): string {
    return this._outputType;
  }

  render(outputData:object): void {
    if(this._plugin.isStub()){
      //this._plugin = new DataTablesPluginImpl();
    }
    else{
      this._plugin.response(outputData);
    }
  }

  clear(): void {
    this._plugin = this._pluginStub;


  }

  request(data: object): void {
    this._channel.request(data);
  }

  response(data: object): void {
    //const message = data as MessageDTO<unknown>;
    //const operation = message.op;
    //if(operation ==='PARAGRAPH_OUTPUT'){
    //  const paragraphOutputDto = message.data as ParagraphOutputDTO;
    //  const output = new ParagraphOutputMessageImpl(paragraphOutputDto).toOutput();
    //  if(output.isStub()){
    //    this._plugin = this._pluginStub;
    //    this._containerRefs.forEach(containerRef => containerRef.clear());
    //  }
    //  else{
    //    const plugin = output.toDataTablesPlugin(this);
    //    if(plugin.isStub()){
    //      this._plugin = this._pluginStub;
    //      this._containerRefs.forEach(containerRef => containerRef.clear());
    //    }
    //    else{
    //      if(this._plugin.isStub()){
    //        this._plugin = plugin;
    //        this._containerRefs.forEach(containerRef => containerRef.createComponent(this._viewComponent, [{name:'plugin', value: this._plugin}]));
    //      }
    //      else{
    //        const dataTablesOutputData:DataTablesOutputData = paragraphOutputDto.output.data as DataTablesOutputData;
    //        this._plugin.response(dataTablesOutputData);
    //      }
    //    }
    //  }
    //}
  }

  switcherButtons(): OutputSwitcherButton[] {
    return this._switcherButtons;
  }
}
