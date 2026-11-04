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
import {WebAppRoot} from './webAppRoot';
import {WebSocketService} from '../../../objects/webSocket/service/webSocketService';
import {NotebookIndexCollection} from '../notebookIndexCollection/notebookIndexCollection';
import {NotebookIndexCollectionResponse} from '../notebookIndexCollection/notebookIndexCollectionResponse';
import {NotebookIndexCollectionImpl} from '../notebookIndexCollection/notebookIndexCollectionImpl';
import {WebSocketChannel} from '../../../objects/webSocket/channel/webSocketChannel';
import {Channel} from '../../../objects/channel/channel';

export class WebAppRootImpl implements WebAppRoot {
  private _hasInitialized:boolean = false;

  private _collection:NotebookIndexCollection;
  private set collection(value:NotebookIndexCollection){
    if(this._collection === undefined){
      this._collection = value;
    }
  }
  private get collection():NotebookIndexCollection{
    return this._collection;
  }

  private _collectionResponse:NotebookIndexCollectionResponse;
  private set collectionResponse(value:NotebookIndexCollectionResponse){
    if(this._collectionResponse === undefined){
      this._collectionResponse = value;
    }
  }
  private get collectionResponse():NotebookIndexCollectionResponse{
    return this._collectionResponse;
  }

  private _webSocket: Channel;
  private set webSocket(value:Channel){
    if(this._webSocket === undefined){
      this._webSocket = value;
    }
  }
  private get webSocket(): Channel{
    return this._webSocket;
  }

  initialize(webSocketService: WebSocketService): void {
    if(this._hasInitialized){
      return;
    }
    this.webSocket = new WebSocketChannel(this, webSocketService);
    const notebookIndexCollection = new NotebookIndexCollectionImpl();
    this.collection = notebookIndexCollection;
    this._collectionResponse = new NotebookIndexCollectionResponse(notebookIndexCollection, this);
    this._hasInitialized = true;
  }

  notebookIndexCollection(): NotebookIndexCollection {
    if(!this._hasInitialized){
      throw new Error('WebAppRoot not initialized');
    }
    return this.collection;
  }

  request(json: object): void {
    if(!this._hasInitialized){
      throw new Error('WebAppRoot not initialized');
    }
    this.webSocket.request(json);
  }

  response(json: object): void {
    if(!this._hasInitialized){
      throw new Error('WebAppRoot not initialized');
    }
    this.collectionResponse.response(json);
  }
}

export const webAppRoot = new WebAppRootImpl();
