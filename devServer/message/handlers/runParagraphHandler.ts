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
import {Handler} from '../../interfaces/handler';
import {ParagraphMessage, ParagraphUpdateOutputMessage, ProgressMessage} from '../../interfaces/sendMessage';
import {RunParagraphMessage} from '../../interfaces/receiveMessage';
import {receiveOperation, sendOperation} from '../webSocketOperations';
import Paragraph from '../../data/paragraph/paragraph';
import DataService from '../../services/dataService';
import NoteService from '../../services/noteService';
import {PaginatedData, RawData, ResultData, ResultType} from '../../types/resultData';
import ParagraphResult from '../../data/paragraph/paragraphResult';

type SentMessages = ParagraphMessage | ProgressMessage | ParagraphUpdateOutputMessage;

export default class RunParagraphHandler implements Handler<RunParagraphMessage, SentMessages>{
  private readonly _client: WebSocket;
  readonly operation = receiveOperation.runParagraph;
  private readonly _noteService: NoteService;
  private readonly _dataService: DataService;
  private readonly _columnCount = 10; // arbitrary
  private readonly _rowCount = 1000; // arbitrary
  private readonly _headers: string[];
  private readonly _baseData: RawData;

  constructor(client, noteService: NoteService) {
    this._client = client;
    this._noteService = noteService;
    this._dataService = new DataService();
    this._headers = this._dataService.headers(this._columnCount);
    this._baseData = this._dataService.rawData(this._columnCount, this._rowCount);
  }

  execute(message: RunParagraphMessage): void {
    const paragraphId = message.data.id;
    const title = message.data.title;
    const text = message.data.paragraph;
    const messageQueue: SentMessages[] = [];
    const result1 = new ParagraphResult();
    const paragraph = new Paragraph('PENDING', result1, text, title, paragraphId);
    messageQueue.push(this.paraMessage(paragraph, message));

    paragraph.updateStatus('RUNNING');
    paragraph.updateProgress(0);
    messageQueue.push(this.paraMessage(paragraph, message));

    for (let i = 1; i < 20; i++) {
      const progress: ProgressMessage = {
        op: sendOperation.progress,
        data:{progress: i*5, id:paragraphId},
        ticket: message.ticket,
        principal: message.principal,
        roles: message.roles,
      };
      messageQueue.push(progress);
    }

    const draws = 5;

    for (let i = 1; i < draws; i++) {
      const index = messageQueue.length / draws;

      const data = {
        headers: this._headers,
        data: this._dataService.paginated(this._baseData, 0, i*2),
        draw: i,
        recordsTotal: this._rowCount,
        recordsFiltered: this._rowCount,
      };

      const updateOutputMessage: ParagraphUpdateOutputMessage = {
        op: sendOperation.paragraphUpdateOutput,
        data:{
          data: data,
          noteId:this._noteService.lastNoteId(),
          paragraphId: paragraphId,
          index: 0,
          type: ResultType.JSONTABLE
        },
        ticket: message.ticket,
        principal: message.principal,
        roles: message.roles,
      };
      messageQueue.splice(i*index,0, updateOutputMessage);
    }
    const resultData: PaginatedData = {
      headers: this._headers,
      data: this._dataService.paginated(this._baseData, 0, 25),
      draw: draws,
      recordsTotal: this._rowCount,
      recordsFiltered: this._rowCount,
    };
    const result2 = new ParagraphResult('SUCCESS', ResultType.JSONTABLE, resultData);
    paragraph.updateStatus('FINISHED');
    paragraph.updateProgress(100);
    paragraph.updateResult(result2);
    messageQueue.push(this.paraMessage(paragraph, message));
    this.updateNotebook(paragraph);
    this.emitMessageQueue(messageQueue);
  }

  send(msg: SentMessages){
    this._client.send(JSON.stringify(msg));
  }

  private updateNotebook(paragraph: Paragraph){
    const noteId = this._noteService.lastNoteId();
    const notebook = this._noteService.find(noteId);
    notebook.paragraphs().updateParagraph(paragraph.id(), paragraph);
    this._noteService.update(notebook, notebook.id());
  }

  private emitMessageQueue(messageQueue: SentMessages[]) {
    for(let i = 0; i < messageQueue.length; i++) {
      const timeout =  (i + 1) * 1000;
      setTimeout(() => {
        this.send(messageQueue[i]);
      }, timeout);
    }
  }

  private paraMessage(paragraph:Paragraph, receivedMessage:RunParagraphMessage): ParagraphMessage{
    return {
      op: sendOperation.paragraph,
      data: {paragraph: paragraph.serialized()},
      ticket: receivedMessage.ticket,
      principal: receivedMessage.principal,
      roles: receivedMessage.roles,
    };
  }
}
