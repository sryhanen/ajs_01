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
import {WebSocketPayload} from '../webSocket/webSocketPayload/webSocketPayload';
import {WebSocketPayloadImpl} from '../webSocket/webSocketPayload/webSocketPayloadImpl';
import {WebSocketResponsePropertyEqualsFilter} from '../webSocket/response/webSocketResponseFilter/webSocketResponsePropertyEqualsFilter';
import {WebSocketResponseImpl} from '../webSocket/response/webSocketResponseImpl';
import {Requestable} from '../channel/requestable';
import {Paragraph} from './paragraph';
import {TreeNodeBranch} from '../treeNode/treeNodeBranch/treeNodeBranch';

export class ParagraphImpl implements Paragraph {
  private readonly _requestable: Requestable;
  private readonly _paragraphState: WebSocketPayload;
  private readonly _paragraphBranch:TreeNodeBranch;
  private readonly _paragraphIdFilter: WebSocketResponsePropertyEqualsFilter;

  constructor(requestable: Requestable, paragraphState: WebSocketPayload, paragraphBranch:TreeNodeBranch) {
    this._requestable = requestable;
    this._paragraphState = paragraphState;
    this._paragraphBranch = paragraphBranch;
    this._paragraphIdFilter = new WebSocketResponsePropertyEqualsFilter('paragraphId', this.id());
  }

  run(): void {
    const runParagraphRequest = {
      op:'RUN_PARAGRAPH',
      data: {
        id: this.id(),
        paragraph: this._paragraphState.stringProperty('text'),
        config: this._paragraphState.objectProperty('config'),
        params: this._paragraphState.objectPropertyAsPayload('settings').objectProperty('params'),
      },
    };
    this._requestable.request(runParagraphRequest);
  }

  response(json: object): void {
    const message = new WebSocketResponseImpl(new WebSocketPayloadImpl(json));
    const filteredResponse = this._paragraphIdFilter.filterResponse(message);
    if(!filteredResponse.isStub()) {
      Object.values(this._paragraphBranch.nodes()()).forEach(node => node.response({
        op:filteredResponse.operation(),
        data:filteredResponse.data()
      }));
    }
  }

  private id():string {
    return this._paragraphState.stringProperty('id');
  }
}
