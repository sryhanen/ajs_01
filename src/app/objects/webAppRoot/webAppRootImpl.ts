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
import {Channel} from '../channel/channel';
import {WebSocketChannel} from '../webSocket/channel/webSocketChannel';
import {NotebookIndexCollectionImpl} from '../notebookIndexCollection/notebookIndexCollectionImpl';
import {WebAppRoot} from './webAppRoot';
import {WebSocketService} from '../webSocket/service/webSocketService';
import {computed, signal, Signal, WritableSignal} from '@angular/core';
import { RenderNode } from '../rendering/renderNode/renderNode';
import {RenderNodeImpl} from '../rendering/renderNode/renderNodeImpl';
import {RegisteredComponents} from '../../ui/angular2+/componentRegistry/registeredComponents';
import {Respondable} from '../channel/respondable';
import {
  NotebookIndexCollectionResponse
} from '../notebookIndexCollection/notebookIndexCollectionResponse/notebookIndexCollectionResponse';
import {Printable} from '../rendering/printable/printable';

class WebAppRootImpl implements WebAppRoot {
  private _hasInitialized:boolean = false;
  private readonly _printSignal: WritableSignal<RenderNode> = signal(undefined);

  private _printable: WritableSignal<Printable>;
  private set printable(value: Printable){
    if(this._printable === undefined){
      this._printable = signal(value);
    }
  }
  private get printable(): Signal<Printable>{
    return this._printable;
  }

  private _respondable:WritableSignal<Respondable>;
  private set respondable(value: Respondable){
    if(this._respondable === undefined){
      this._respondable = signal(value);
    }
  }
  private get respondable(): Signal<Respondable>{
    return this._respondable;
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

  initialize(webSocketService:WebSocketService){
    if(this._hasInitialized){
      return;
    }
    const notebookIndices = signal(new Map(), {equal:() => false});
    const renderNode = new RenderNodeImpl(RegisteredComponents.NOTEBOOK_INDEX_COLLECTION_VIEW, computed(() => ({
      notebookIndices:Array.from(notebookIndices().values()).map(notebookIndex => notebookIndex.print()())
    })));
    const notebookIndexCollection = new NotebookIndexCollectionImpl(notebookIndices, signal(renderNode));
    this.printable = notebookIndexCollection;
    const respondables = computed(() => Array.from(notebookIndices().values()));
    this.respondable = new NotebookIndexCollectionResponse(notebookIndexCollection, respondables, this);
    this._printSignal.set(this._printable().print()());
    this.webSocket = new WebSocketChannel(this, webSocketService);
    this._hasInitialized = true;
  }

  print(): Signal<RenderNode> {
    if(!this._hasInitialized){
      throw new Error('WebAppRoot not initialized');
    }
    return this._printSignal;
  }

  request(data: object): void {
    if(!this._hasInitialized){
      throw new Error('WebAppRoot not initialized');
    }
    this.webSocket.request(data);
  }

  response(data: object): void {
    if(!this._hasInitialized){
      throw new Error('WebAppRoot not initialized');
    }
    this.respondable().response(data);
    this._printSignal.set(this.printable().print()());
  }
}

export const webAppRoot = new WebAppRootImpl();
