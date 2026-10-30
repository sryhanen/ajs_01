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
import {Respondable} from '../channel/respondable';
import {WebSocketResponse} from '../webSocket/response/webSocketResponse';
import {Requestable} from '../channel/requestable';
import {WebSocketResponseImpl} from '../webSocket/response/webSocketResponseImpl';
import {WebSocketPayloadImpl} from '../webSocket/webSocketPayload/webSocketPayloadImpl';
import {TreeNodeBranch} from '../treeNode/treeNodeBranch/treeNodeBranch';
import {ParagraphTreeNodeBuilder} from '../paragraph/paragraphTreeNodeBuilder/paragraphTreeNodeBuilder';
import {ParagraphTreeNodeBuilderImpl} from '../paragraph/paragraphTreeNodeBuilder/paragraphTreeNodeBuilderImpl';

export class ParagraphCollection implements Respondable {
  private readonly _requestable: Requestable;
  private readonly _paragraphCollectionBranch:TreeNodeBranch;
  private readonly _responseEvents:Readonly<Record<string, (webSocketResponse:WebSocketResponse) => void>>;
  private readonly _paragraphTreeNodeBuilder:ParagraphTreeNodeBuilder;

  constructor(requestable: Requestable, paragraphCollectionBranch:TreeNodeBranch) {
    this._requestable = requestable;
    this._paragraphCollectionBranch = paragraphCollectionBranch;
    this._responseEvents = {
      'PARAGRAPH':(webSocketResponse) => this.handleParagraphResponse(webSocketResponse),
      'PARAGRAPH_ADDED': (webSocketResponse) => this.handleParagraphAddedResponse(webSocketResponse),
      'PARAGRAPH_REMOVED': (webSocketResponse) => this.handleParagraphRemovedResponse(webSocketResponse)
    };
    this._paragraphTreeNodeBuilder = new ParagraphTreeNodeBuilderImpl();
  }

  response(json: object) {
    const webSocketResponse = new WebSocketResponseImpl(new WebSocketPayloadImpl(json));
    const eventName = webSocketResponse.operation();
    if(eventName in this._responseEvents) {
      this._responseEvents[eventName](webSocketResponse);
    }
    else{
      Object.values(this._paragraphCollectionBranch.nodes()()).forEach(paragraphNode => paragraphNode.response(json));
    }
  }

  private handleParagraphResponse(webSocketResponse:WebSocketResponse):void{
    const paragraphState = webSocketResponse.dataAsWebSocketPayload();
    const paragraphNode = this._paragraphTreeNodeBuilder.paragraphTreeNode(paragraphState, this._requestable);
    this._paragraphCollectionBranch.update(paragraphNode);
  }

  private handleParagraphAddedResponse(webSocketResponse:WebSocketResponse):void{
    const responseData = webSocketResponse.dataAsWebSocketPayload();
    const paragraphState = responseData.objectPropertyAsPayload('paragraph');
    const index = responseData.numberProperty('index');
    const paragraphNode = this._paragraphTreeNodeBuilder.paragraphTreeNode(paragraphState, this._requestable);
    this._paragraphCollectionBranch.add(paragraphNode, index);
  }

  private handleParagraphRemovedResponse(webSocketResponse:WebSocketResponse):void{
    const paragraphId  = webSocketResponse.dataAsWebSocketPayload().stringProperty('id');
    this._paragraphCollectionBranch.remove(paragraphId);
  }
}
