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
import {Signal} from '@angular/core';
import { RenderNode } from '../rendering/renderNode/renderNode';
import {
  NotebookIndexCollectionResponse
} from '../notebookIndexCollection/notebookIndexCollectionResponse/notebookIndexCollectionResponse';
import {TreeNodeTreeImpl} from '../treeNode/treeNodeTree/treeNodeTreeImpl';
import {TreeNodeImpl} from '../treeNode/treeNodeImpl';
import {TreeNode} from '../treeNode/treeNode';

class WebAppRootImpl implements WebAppRoot {
  private _hasInitialized:boolean = false;

  private _treeNode: TreeNode;
  private set treeNode(value: TreeNode){
    if(this._treeNode === undefined){
      this._treeNode = value;
    }
  }
  private get treeNode(): TreeNode{
    return this._treeNode;
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
    const treeNodeTree = new TreeNodeTreeImpl();
    const notebookIndexCollection = new NotebookIndexCollectionImpl(treeNodeTree);
    const notebookIndexCollectionResponse = new NotebookIndexCollectionResponse(treeNodeTree, this);
    treeNodeTree.add(new TreeNodeImpl(this, notebookIndexCollectionResponse, notebookIndexCollection, 'notebookIndexCollection'));
    this.treeNode = Array.from(treeNodeTree.nodes()())[0];
    this.webSocket = new WebSocketChannel(this, webSocketService);
    this._hasInitialized = true;
  }

  print(): Signal<RenderNode> {
    if(!this._hasInitialized){
      throw new Error('WebAppRoot not initialized');
    }
    return this.treeNode.print();
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
    this.treeNode.response(data);
  }
}

export const webAppRoot = new WebAppRootImpl();
