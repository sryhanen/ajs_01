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
import {FakeServerEvent} from '../fakeServerEvent';
import {OutputType} from '../../../src/app/objects/output/outputType';
import {uPlotResultService} from '../../services/uPlotResultService/uPlotResultService';
import {uPlotResultServiceImpl} from '../../services/uPlotResultService/uPlotResultServiceImpl';
import {
  ParagraphOutputServerResponse
} from '../../../src/test/data/serverWebSocketResponses/paragraphOutput/paragraphOutputServerResponse';
import {WebSocketServerResponse} from '../../../src/test/data/serverWebSocketResponses/webSocketServerResponse';
import { Message } from '../../../src/app/objects/message/message';
import {DataTablesDataFactory} from '../../../src/test/data/output/dataTables/dataTablesDataFactory';
import {DataTablesDataFactoryImpl} from '../../../src/test/data/output/dataTables/dataTablesDataFactoryImpl';

export default class ParagraphOutputRequestEvent implements FakeServerEvent {
  private readonly  _webSocket: WebSocket;
  private readonly _eventId: string;
  private readonly _dataTablesDataFactory: DataTablesDataFactory;
  private readonly _uPlotResultService: uPlotResultService;

  constructor(webSocket: WebSocket) {
    this._webSocket = webSocket;
    this._eventId = 'PARAGRAPH_OUTPUT_REQUEST';
    this._dataTablesDataFactory = new DataTablesDataFactoryImpl();
    this._uPlotResultService = new uPlotResultServiceImpl();
  }

  eventId(): string {
    return this._eventId;
  }

  handle(requestMessage: Message): void {
    const messageData = requestMessage.dataAsWebSocketPayload();
    const outputType = messageData.stringProperty('type');
    let paragraphOutputResponse:WebSocketServerResponse;
    const noteId = messageData.stringProperty('noteId');
    const paragraphId = messageData.stringProperty('paragraphId');
    const requestOptions = messageData.objectPropertyAsPayload('requestOptions');
    if(outputType === OutputType.dataTables){
      const start = requestOptions.numberProperty('start');
      const length = requestOptions.numberProperty('length');
      const draw = requestOptions.numberProperty('draw');
      const rawData = this._dataTablesDataFactory.rawData(1000);
      const paginatedData = this._dataTablesDataFactory.paginatedData(rawData, start, length, draw);
      const outputOptions = {headers:Object.keys(paginatedData.data[0])};
      paragraphOutputResponse = new ParagraphOutputServerResponse(paragraphId, noteId, OutputType.dataTables, paginatedData, true, outputOptions);
    }
    else if(outputType === OutputType.uPlot){
      const graphType = requestOptions.stringProperty('graphType');
      paragraphOutputResponse = new ParagraphOutputServerResponse(paragraphId, noteId, OutputType.uPlot, this._uPlotResultService.outputData(), true, this._uPlotResultService.options(graphType));
    }
    this._webSocket.send(paragraphOutputResponse.toJson());
  }
}
