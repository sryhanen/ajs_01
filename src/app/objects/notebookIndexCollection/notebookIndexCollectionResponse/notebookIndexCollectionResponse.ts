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
import {NotebookIndexCollection} from '../notebookIndexCollection';
import {computed, signal, WritableSignal} from '@angular/core';
import {WebSocketPayloadImpl} from '../../webSocket/webSocketPayload/webSocketPayloadImpl';
import {WebSocketResponseImpl} from '../../webSocket/response/webSocketResponseImpl';
import {WebSocketResponse} from '../../webSocket/response/webSocketResponse';
import {TypedWebSocketResponse} from '../../webSocket/response/typedWebSocketResponse/typedWebSocketResponse';
import {NotebookStub} from '../../notebook/notebookStub';
import {RenderNodeImpl} from '../../rendering/renderNode/renderNodeImpl';
import {RegisteredComponents} from '../../../ui/angular2+/componentRegistry/registeredComponents';
import {RenderNodeStub} from '../../rendering/renderNode/renderNodeStub';
import {NotebookIndexImpl} from '../../notebookIndex/notebookIndexImpl';
import {Requestable} from '../../channel/requestable';
import {NotebookIndexResponse} from '../../notebookIndex/notebookIndexResponse/notebookIndexResponse';

export class NotebookIndexCollectionResponse implements Respondable {
  private readonly _notebookIndexCollection: NotebookIndexCollection;
  private readonly _respondables: WritableSignal<Respondable[]>;
  private readonly _requestable: Requestable;

  constructor(notebookIndexCollection: NotebookIndexCollection, respondables: WritableSignal<Respondable[]>, requestable:Requestable) {
    this._notebookIndexCollection = notebookIndexCollection;
    this._respondables = respondables;
    this._requestable = requestable;
  }

  response(json: object) {
    const webSocketResponse = new WebSocketResponseImpl(new WebSocketPayloadImpl(json));
    if(webSocketResponse.operation() === 'NOTES_INFO'){
      this.handleNotesInfoResponse(webSocketResponse);
    }
    else{
      this._respondables().forEach(respondable => respondable.response(json));
    }
  }

  private handleNotesInfoResponse(webSocketResponse:WebSocketResponse):void{
    const notesInfoResponse = new TypedWebSocketResponse('NOTES_INFO', webSocketResponse);
    const notebookIndicesPayload = notesInfoResponse.dataAsWebSocketPayload().arrayProperty<object>('notes');
    this._notebookIndexCollection.clear();
    this._respondables.set([]);
    notebookIndicesPayload.forEach(notebookIndexPayload => {
      const notebookIndexState = new WebSocketPayloadImpl(notebookIndexPayload);
      const notebook = signal(new NotebookStub());
      const renderNode = signal(new RenderNodeImpl(RegisteredComponents.NOTEBOOK_INDEX_VIEW, computed(() => ({
        notebook: notebook().isStub() ? new RenderNodeStub() : notebook().print()()
      }))));
      const notebookIndex = new NotebookIndexImpl(notebookIndexState, notebook, renderNode);
      this._notebookIndexCollection.add(notebookIndex);
      const notebookIndexResponse = new NotebookIndexResponse(notebook, this._requestable, notebookIndex);
      this._respondables.update(respondables => {
        respondables.push(notebookIndexResponse);
        return respondables;
      });
    });
  }
}
