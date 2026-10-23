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
import {WebSocketResponseImpl} from '../../webSocket/response/webSocketResponseImpl';
import {WebSocketPayloadImpl} from '../../webSocket/webSocketPayload/webSocketPayloadImpl';
import {Requestable} from '../../channel/requestable';
import {WebSocketResponse} from '../../webSocket/response/webSocketResponse';
import {TypedWebSocketResponse} from '../../webSocket/response/typedWebSocketResponse/typedWebSocketResponse';
import {NotebookImpl} from '../../notebook/notebookImpl';
import {Signal} from '@angular/core';
import {Notebook} from '../../notebook/notebook';
import {NotebookIndexBehavior} from '../behavior/notebookIndexBehavior';
import {NotebookBehaviorImpl} from '../../notebook/behavior/notebookBehaviorImpl';
import {ParagraphCollectionImpl} from '../../paragraphCollection/paragraphCollectionImpl';
import {PrintableNotebook} from '../../notebook/printable/printableNotebook';
import {RequestableNotebook} from '../../notebook/channel/requestableNotebook';
import {RespondableNotebook} from '../../notebook/channel/respondableNotebook';

export class NotebookIndexChannel implements Channel {
  private readonly _requestable: Requestable;
  private readonly _openedNotebook: Signal<Notebook>;
  private readonly _notebookIndexBehavior: NotebookIndexBehavior;

  constructor(requestable: Requestable, openedNotebook: Signal<Notebook>, notebookIndexBehavior:NotebookIndexBehavior) {
    this._requestable = requestable;
    this._openedNotebook = openedNotebook;
    this._notebookIndexBehavior = notebookIndexBehavior;
  }

  request(json: object): void {
    this._requestable.request(json);
  }

  response(json: object): void {
    const webSocketResponse = new WebSocketResponseImpl(new WebSocketPayloadImpl(json));
    if(webSocketResponse.operation() === 'NOTE'){
      this.handleNoteResponseEvent(webSocketResponse);
    }
    else if(!this._openedNotebook().isStub()){
      this._openedNotebook().response(json);
    }
  }

  private handleNoteResponseEvent(webSocketResponse: WebSocketResponse): void {
    const noteResponse = new TypedWebSocketResponse('NOTE', webSocketResponse);
    const receivedNotebookId = noteResponse.dataAsWebSocketPayload().stringProperty('id');
    if(receivedNotebookId === this._notebookIndexBehavior.id()){
      const notebookState = noteResponse.dataAsWebSocketPayload();
      const notebookBehavior = new NotebookBehaviorImpl(notebookState);
      const notebookParagraphs = notebookState.arrayProperty<object>('paragraphs');
      const notebookId = notebookState.stringProperty('id');
      const requestableNotebook = new RequestableNotebook(this, notebookId);
      const paragraphCollection = new ParagraphCollectionImpl(requestableNotebook, notebookParagraphs);
      const respondableNotebook = new RespondableNotebook(paragraphCollection, notebookId);
      const printableNotebook = new PrintableNotebook(paragraphCollection);
      const notebook = new NotebookImpl(notebookBehavior,printableNotebook, respondableNotebook, requestableNotebook);
      this._notebookIndexBehavior.open(notebook);
    }
  }
}
