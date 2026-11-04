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
import {Respondable} from '../../../objects/channel/respondable';
import {NotebookIndexCollection} from './notebookIndexCollection';
import {Requestable} from '../../../objects/channel/requestable';
import {WebSocketResponseImpl} from '../../../objects/webSocket/response/webSocketResponseImpl';
import {WebSocketPayloadImpl} from '../../../objects/webSocket/webSocketPayload/webSocketPayloadImpl';
import {WebSocketResponse} from '../../../objects/webSocket/response/webSocketResponse';
import {
  TypedWebSocketResponse
} from '../../../objects/webSocket/response/typedWebSocketResponse/typedWebSocketResponse';
import {NotebookIndexImpl} from '../notebookIndex/notebookIndexImpl';
import {NotebookIndexResponse} from '../notebookIndex/notebookIndexResponse';

export class NotebookIndexCollectionResponse implements Respondable {
  private readonly _notebookIndexCollection:NotebookIndexCollection;
  private readonly _requestable:Requestable;
  private readonly _respondables:Respondable[];

  constructor(notebookIndexCollection:NotebookIndexCollection, requestable:Requestable) {
    this._notebookIndexCollection = notebookIndexCollection;
    this._requestable = requestable;
    this._respondables = [];
  }

  response(json: object): void {
    const webSocketResponse = new WebSocketResponseImpl(new WebSocketPayloadImpl(json));
    if(webSocketResponse.operation() === 'NOTES_INFO'){
      this.handleNotesInfoResponse(webSocketResponse);
    }
    else{
      this._respondables.forEach(respondable => respondable.response(json));
    }
  }

  private handleNotesInfoResponse(webSocketResponse:WebSocketResponse):void{
    const notesInfoResponse = new TypedWebSocketResponse('NOTES_INFO', webSocketResponse);
    const notebookIndicesPayload = notesInfoResponse.dataAsWebSocketPayload().arrayProperty<object>('notes');
    this._notebookIndexCollection.clear();
    this._respondables.splice(0, this._respondables.length);
    notebookIndicesPayload.forEach(notebookIndexPayload => {
      const notebookIndexState = new WebSocketPayloadImpl(notebookIndexPayload);
      const notebookIndex = new NotebookIndexImpl(notebookIndexState);
      this._notebookIndexCollection.add(notebookIndex);
      const notebookId = notebookIndexState.stringProperty('id');
      const notebookIndexResponse = new NotebookIndexResponse(notebookIndex, [], notebookId, this._requestable);
      this._respondables.push(notebookIndexResponse);
    });
  }
}
