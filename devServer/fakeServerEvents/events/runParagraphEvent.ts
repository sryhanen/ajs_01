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
import ParagraphImpl from '../../data/paragraph/paragraphImpl';
import {DataTablesService} from '../../services/dataService/dataTablesService';
import DataTablesServiceImpl from '../../services/dataService/dataTablesServiceImpl';
import NoteService from '../../services/noteService';
import {OutputType} from '../../../src/app/objects/output/outputType';
import {
  ParagraphServerResponse
} from '../../../src/test/data/serverWebSocketResponses/paragraph/paragraphServerResponse';
import {ProgressServerResponse} from '../../../src/test/data/serverWebSocketResponses/progress/progressServerResponse';
import {
  ParagraphOutputServerResponse
} from '../../../src/test/data/serverWebSocketResponses/paragraphOutput/paragraphOutputServerResponse';
import { Message } from '../../../src/app/objects/message/message';

export default class RunParagraphEvent implements FakeServerEvent {
  private readonly _webSocket: WebSocket;
  private readonly _noteService: NoteService;
  private readonly _eventId:string;
  private readonly _dataTablesService: DataTablesService;
  private readonly _rowCount = 1000;
  private readonly _baseData: object[];

  constructor(webSocket: WebSocket, noteService: NoteService) {
    this._webSocket = webSocket;
    this._noteService = noteService;
    this._eventId = 'RUN_PARAGRAPH';
    this._dataTablesService = new DataTablesServiceImpl();
    this._baseData = this._dataTablesService.rawData(this._rowCount);
  }

  eventId(): string {
    return this._eventId;
  }

  handle(requestMessage: Message): void {
    const requestMessageData = requestMessage.dataAsWebSocketPayload();
    const paragraphId = requestMessageData.stringProperty('id');
    const title = requestMessage.data()['title'];
    const text = requestMessageData.stringProperty('paragraph');
    const messageQueue: string[] = [];
    const paragraph = new ParagraphImpl('PENDING', undefined, text, title, paragraphId);
    messageQueue.push(new ParagraphServerResponse(paragraph).toJson());

    paragraph.status = 'RUNNING';
    paragraph.progress = 0;
    messageQueue.push(new ParagraphServerResponse(paragraph).toJson());

    for (let i = 1; i < 20; i++){
      messageQueue.push(new ProgressServerResponse(i*5, paragraphId).toJson());
    }

    const noteId = this._noteService.lastNoteId();
    const options = this._dataTablesService.options(this._baseData);
    const draws = 5;
    for (let i = 1; i < draws; i++) {
      const index = messageQueue.length / draws;
      const interimOutput = this._dataTablesService.paginated(this._baseData, 0, i*8, i);
      const paragraphOutputResponse = new ParagraphOutputServerResponse(paragraphId, noteId, OutputType.dataTables, interimOutput, true, options);
      messageQueue.splice(i*index,0, paragraphOutputResponse.toJson());
    }
    const finalOutput = this._dataTablesService.paginated(this._baseData, 0, 50, draws);
    const paragraphOutputResponse = new ParagraphOutputServerResponse(paragraphId, noteId, OutputType.dataTables, finalOutput, true, options);
    paragraph.status = 'FINISHED';
    paragraph.progress = 100;
    paragraph.output = {data: finalOutput, options: this._dataTablesService.options(this._baseData), type:OutputType.dataTables, isAggregated:true};
    messageQueue.push(paragraphOutputResponse.toJson());
    messageQueue.push(new ParagraphServerResponse(paragraph).toJson());
    this.updateNotebook(paragraph);
    for(let i = 0; i < messageQueue.length; i++) {
      const timeout =  (i + 1) * 1000;
      setTimeout(() => {
        this._webSocket.send(messageQueue[i]);
      }, timeout);
    }
  }

  private updateNotebook(paragraph: ParagraphImpl){
    const noteId = this._noteService.lastNoteId();
    const notebook = this._noteService.find(noteId);
    const paragraphIndex = notebook.paragraphs.findIndex(p => p.id === paragraph.id);
    notebook.paragraphs.splice(paragraphIndex,1, paragraph);
    this._noteService.update(notebook, notebook.id);
  }
}
