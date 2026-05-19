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
import {WebSocket} from 'ws';
import {Handler} from './handler';
import {receiveOperation, sendOperation} from '../webSocketOperations';
import {DataTablesService} from '../../services/dataService/dataTablesService';
import DataTablesServiceImpl from '../../services/dataService/dataTablesServiceImpl';
import {MessageDTO} from '../../../src/app/angular2+/objects/message/messageDTO';
import {ParagraphOutputRequestDTO} from '../../../src/app/angular2+/objects/output/paragraphOutputRequest/paragraphOutputRequestDTO';
import {ParagraphOutputDTO} from '../../../src/app/angular2+/objects/message/paragraphOutputMessage/paragraphOutputDTO';
import {OutputType} from '../../../src/app/angular2+/objects/output/outputType';
import {OutputDTO} from '../../../src/app/angular2+/objects/output/outputDTO';
import {uPlotResultService} from '../../services/uPlotService/uPlotResultService';
import {uPlotResultServiceImpl} from '../../services/uPlotService/uPlotResultServiceImpl';


export default class ParagraphOutputRequestHandler implements Handler<MessageDTO<ParagraphOutputRequestDTO>>{
  private readonly _dataTablesService: DataTablesService;
  private readonly _uPlotResultService: uPlotResultService;

  constructor() {
    this._dataTablesService = new DataTablesServiceImpl();
    this._uPlotResultService = new uPlotResultServiceImpl();
  }

  operation(){
    return receiveOperation.paragraphOutputRequest;
  }

  execute(message: MessageDTO<ParagraphOutputRequestDTO>, client: WebSocket): void  {
    const result = this.result(message);
    client.send(JSON.stringify(result));
  }

  private result(message: MessageDTO<ParagraphOutputRequestDTO>): MessageDTO<ParagraphOutputDTO>{
    const rawData = this._dataTablesService.rawData(1000);
    let output:OutputDTO<unknown>;

    if(message.data.type === OutputType.dataTables){
      const options = message.data.requestOptions as {start:number, length:number, draw:number};
      const paginated = this._dataTablesService.paginated(rawData, options.start, options.length, options.draw);
      output = {
        type: OutputType.dataTables,
        data: paginated,
        options: this._dataTablesService.options(rawData),
        isAggregated:true
      };
    }
    else if(message.data.type === OutputType.uPlot){
      const requestOptions = message.data.requestOptions as {graphType: string};
      output = {
        type: OutputType.uPlot,
        data: this._uPlotResultService.outputData(),
        options: this._uPlotResultService.options(requestOptions.graphType),
        isAggregated:true
      };
    }

    return {
      op: sendOperation.paragraphOutput,
      data: {
        noteId: message.data.noteId,
        paragraphId: message.data.paragraphId,
        output:output,
      },
    };
  }

}
