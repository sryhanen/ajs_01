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
import {Respondable} from '../../channel/respondable';
import {computed, signal, WritableSignal} from '@angular/core';
import {WebSocketResponseImpl} from '../../webSocket/response/webSocketResponseImpl';
import {WebSocketPayloadImpl} from '../../webSocket/webSocketPayload/webSocketPayloadImpl';
import {WebSocketResponse} from '../../webSocket/response/webSocketResponse';
import {TypedWebSocketResponse} from '../../webSocket/response/typedWebSocketResponse/typedWebSocketResponse';
import {NotebookRequest} from '../../notebook/notebookRequest/notebookRequest';
import {ParagraphCollectionImpl} from '../../paragraphCollection/paragraphCollectionImpl';
import {NotebookImpl} from '../../notebook/notebookImpl';
import {Requestable} from '../../channel/requestable';
import {NotebookIndex} from '../notebookIndex';
import {NotebookResponseImpl} from '../../notebook/notebookResponse/notebookResponseImpl';
import {NotebookResponse} from '../../notebook/notebookResponse/notebookResponse';
import {
  ParagraphCollectionRequest
} from '../../paragraphCollection/paragraphCollectionRequest/paragraphCollectionRequest';
import {
  ParagraphCollectionResponse
} from '../../paragraphCollection/paragraphCollectionResponse/paragraphCollectionResponse';
import {Paragraph} from '../../paragraph/paragraph';
import {WebSocketPayload} from '../../webSocket/webSocketPayload/webSocketPayload';
import {ParagraphImpl} from '../../paragraph/paragraphImpl';

export class NotebookIndexResponse implements Respondable{
  private readonly _notebookResponse: WritableSignal<NotebookResponse>;
  private readonly _requestable: Requestable;
  private readonly _notebookIndex:NotebookIndex;

  constructor(notebookResponse: WritableSignal<NotebookResponse>, requestable: Requestable, notebookIndex:NotebookIndex) {
    this._notebookResponse = notebookResponse;
    this._requestable = requestable;
    this._notebookIndex = notebookIndex;
  }

  response(json: object): void {
    const webSocketResponse = new WebSocketResponseImpl(new WebSocketPayloadImpl(json));
    if(webSocketResponse.operation() === 'NOTE'){
      this.handleNoteResponseEvent(webSocketResponse);
    }
    else if(!this._notebookResponse().isStub()){
      this._notebookResponse().response(json);
    }
  }

  private handleNoteResponseEvent(webSocketResponse: WebSocketResponse): void {
    const noteResponse = new TypedWebSocketResponse('NOTE', webSocketResponse);
    const notebookState = noteResponse.dataAsWebSocketPayload();
    const receivedNotebookId= notebookState.stringProperty('id');
    if(receivedNotebookId === this._notebookIndex.id()){
      const notebookRequest = new NotebookRequest(this._requestable, receivedNotebookId);
      const paragraphs: WritableSignal<Map<string, Paragraph>> = signal(new Map(), {equal:() => false});
      const paragraphCollection =  new ParagraphCollectionImpl(paragraphs);
      const paragraphCollectionRequest = new ParagraphCollectionRequest(notebookRequest, paragraphCollection);
      paragraphs.set(this.initializedParagraphs(notebookState, paragraphCollectionRequest));
      const paragraphCollectionResponse = new ParagraphCollectionResponse(computed(() => Array.from(paragraphs().values())), paragraphCollectionRequest, paragraphCollection);
      const notebook = new NotebookImpl(notebookState, paragraphCollection);
      const notebookResponse = new NotebookResponseImpl(paragraphCollectionResponse, notebookState.stringProperty('id'));
      this._notebookResponse.set(notebookResponse);
      this._notebookIndex.openNotebook(notebook);
    }
  }

  private initializedParagraphs(notebookState:WebSocketPayload, requestable:Requestable): Map<string,  Paragraph> {
    const paragraphMap = new Map<string, Paragraph>();
    const paragraphs = notebookState.arrayProperty<object>('paragraphs');
    paragraphs.forEach(paragraphData => {
      const paragraph = new ParagraphImpl(requestable, paragraphData);
      paragraphMap.set(paragraph.id(), paragraph);
    });
    return paragraphMap;
  }
}
