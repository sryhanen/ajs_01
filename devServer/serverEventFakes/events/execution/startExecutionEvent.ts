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
import NoteServiceImpl from '../../../services/noteService/noteServiceImpl';
import {DataTablesDataFactory} from '../../../../src/test/fakes/server/output/dataTables/dataTablesDataFactory';
import {OutputPayloadFakeFactory} from '../../../../src/test/fakes/server/output/outputPayloadFakeFactory';
import {DataTablesDataFactoryImpl} from '../../../../src/test/fakes/server/output/dataTables/dataTablesDataFactoryImpl';
import {OutputPayloadFakeFactoryImpl} from '../../../../src/test/fakes/server/output/outputPayloadFakeFactoryImpl';
import {ServerEventFake} from '../../serverEventFake';
import {WebSocketResponse} from '../../../../src/app/objects/webSocket/response/webSocketResponse';
import {
  ExecutionStatusServerResponse
} from '../../../../src/test/fakes/server/webSocketResponses/executionStatus/executionStatusServerResponse';
import {DateFakeImpl} from '../../../../src/test/fakes/server/date/dateFakeImpl';
import {
  AngularObjectUpdateServerResponse
} from '../../../../src/test/fakes/server/webSocketResponses/angularObjectUpdate/angularObjectUpdateServerResponse';
import {
  ParagraphOutputServerResponse
} from '../../../../src/test/fakes/server/webSocketResponses/paragraphOutput/paragraphOutputServerResponse';
import {
  ClearOutputServerResponse
} from '../../../../src/test/fakes/server/webSocketResponses/clearOutput/clearOutputServerResponse';

export class StartExecutionEvent implements ServerEventFake{
  private readonly _webSocket: WebSocket;
  private readonly _noteService: NoteServiceImpl;
  private readonly _eventId:string;
  private readonly _dataTablesDataFactory: DataTablesDataFactory;
  private readonly _fakeOutputPayloadFactory: OutputPayloadFakeFactory;

  constructor(webSocket: WebSocket, noteService: NoteServiceImpl) {
    this._webSocket = webSocket;
    this._noteService = noteService;
    this._eventId = 'START_EXECUTION';
    this._dataTablesDataFactory = new DataTablesDataFactoryImpl();
    this._fakeOutputPayloadFactory = new OutputPayloadFakeFactoryImpl();
  }

  eventId(): string {
    return this._eventId;
  }

  handle(webSocketResponseFromClient: WebSocketResponse):void {
    const simulatedEventTimeLength = 15000;
    const dateStarted = new DateFakeImpl(Date.now()).toString();
    const noteId = webSocketResponseFromClient.dataAsWebSocketPayload().stringProperty('noteId');
    const paragraphId = webSocketResponseFromClient.dataAsWebSocketPayload().stringProperty('paragraphId');
    const batchUpdateCount = 5;
    this.sendInitialExecutionStatusMessages(dateStarted);
    this.sendClearOutputMessage(noteId, paragraphId);
    this.sendFinishedExecutionStateMessage(dateStarted, simulatedEventTimeLength);
    this.sendDplLogUpdates(batchUpdateCount, simulatedEventTimeLength, paragraphId, noteId);
    this.sendOutputUpdates(batchUpdateCount, simulatedEventTimeLength, paragraphId, noteId);
  }

  private sendClearOutputMessage(noteId:string, paragraphId:string):void{
    setTimeout(() => {
      const clearOutputMessage = new ClearOutputServerResponse(noteId, paragraphId);
      this._webSocket.send(clearOutputMessage.toJson());
    },1000);
  }

  private sendFinishedExecutionStateMessage(dateStarted:string, simulatedEventTimeLength:number):void{
    setTimeout(() => {
      const dateFinished = new DateFakeImpl(Date.now()).toString();
      const finishedStatus = new ExecutionStatusServerResponse('FINISHED', 'anonymous', dateStarted, dateFinished);
      this._webSocket.send(finishedStatus.toJson());
    },simulatedEventTimeLength);
  }

  private sendInitialExecutionStatusMessages(dateStarted:string):void{
    const pendingStatus = new ExecutionStatusServerResponse('PENDING', 'anonymous', dateStarted, '');
    const runningStatus = new ExecutionStatusServerResponse('RUNNING', 'anonymous', dateStarted, '');
    setTimeout(() => {
      this._webSocket.send(pendingStatus.toJson());
    }, 500);
    setTimeout(() => {
      this._webSocket.send(runningStatus.toJson());
    }, 1000);
  }

  private sendDplLogUpdates(batchUpdateCount:number,  simulatedEventTimeLength:number, paragraphId:string, noteId:string):void{
    const interval = simulatedEventTimeLength / batchUpdateCount;
    for (let i = 0; i < batchUpdateCount; i++) {
      const timeout = (i+1) * interval;
      setTimeout(() => {
        const dplLogMessage = new AngularObjectUpdateServerResponse('batchMsg', `Batch message value ${i}.`, paragraphId, noteId);
        this._webSocket.send(dplLogMessage.toJson());
      }, timeout);
    }
  }

  private sendOutputUpdates(batchUpdateCount:number,  simulatedEventTimeLength:number, paragraphId:string, noteId:string):void{
    const interval = simulatedEventTimeLength / batchUpdateCount;
    const rowCount = 100;
    const rawData = this._dataTablesDataFactory.rawData(rowCount);
    const startIndex = 0;
    for (let i = 0; i < batchUpdateCount; i++) {
      const timeout = (i+1) * interval;
      const draw = i+1;
      const endIndex = draw*8;
      setTimeout(() => {
        const interimOutputData = this._dataTablesDataFactory.paginatedData(rawData, startIndex, endIndex, draw);
        const interimOutput = this._fakeOutputPayloadFactory.dataTablesOutputPayload(interimOutputData);
        const outputMessage = new ParagraphOutputServerResponse(paragraphId, noteId, interimOutput);
        this._webSocket.send(outputMessage.toJson());
      }, timeout);
    }
    setTimeout(() => {
      const endIndex = 50;
      const draw = batchUpdateCount+1;
      const finalOutputData = this._dataTablesDataFactory.paginatedData(rawData, startIndex, endIndex, draw);
      const finalOutput= this._fakeOutputPayloadFactory.dataTablesOutputPayload(finalOutputData);
      const paragraphOutputResponse = new ParagraphOutputServerResponse(paragraphId, noteId, finalOutput);
      this._webSocket.send(paragraphOutputResponse.toJson());
    }, simulatedEventTimeLength);
  }
}
