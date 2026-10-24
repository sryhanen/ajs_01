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
import {WebSocketResponseImpl} from '../../webSocket/response/webSocketResponseImpl';
import {WebSocketPayloadImpl} from '../../webSocket/webSocketPayload/webSocketPayloadImpl';
import {WebSocketResponse} from '../../webSocket/response/webSocketResponse';
import {TypedWebSocketResponse} from '../../webSocket/response/typedWebSocketResponse/typedWebSocketResponse';
import {ParagraphCollectionBehavior} from '../behavior/paragraphCollectionBehavior';
import {Requestable} from '../../channel/requestable';
import {Signal} from '@angular/core';
import {ParagraphBuilder} from '../../paragraphBuilder/paragraphBuilder';

export class RespondableParagraphCollection implements Respondable {
  private readonly _paragraphCollectionBehavior: ParagraphCollectionBehavior;
  private readonly _respondables: Signal<Respondable[]>;
  private readonly _requestable: Requestable;
  private readonly _responseEvents:Readonly<Record<string, (webSocketResponse:WebSocketResponse) => void>>;
  private readonly _paragraphBuilder: ParagraphBuilder;

  constructor(paragraphCollectionBehavior:ParagraphCollectionBehavior, respondables:Signal<Respondable[]>, requestable:Requestable, paragraphBuilder: ParagraphBuilder) {
    this._paragraphCollectionBehavior = paragraphCollectionBehavior;
    this._respondables = respondables;
    this._requestable = requestable;
    this._paragraphBuilder = paragraphBuilder;
    this._responseEvents = {
      'PARAGRAPH':(webSocketResponse) => this.handleParagraphResponse(webSocketResponse),
      'PARAGRAPH_ADDED': (webSocketResponse) => this.handleParagraphAddedResponse(webSocketResponse),
      'PARAGRAPH_REMOVED': (webSocketResponse) => this.handleParagraphRemovedResponse(webSocketResponse)
    };
  }

  response(json: object): void {
    const webSocketResponse = new WebSocketResponseImpl(new WebSocketPayloadImpl(json));
    const eventName = webSocketResponse.operation();
    if(eventName in this._responseEvents) {
      this._responseEvents[eventName](webSocketResponse);
    }
    else{
      this._respondables().forEach(respondable => respondable.response(json));
    }
  }

  private handleParagraphResponse(webSocketResponse:WebSocketResponse):void{
    const paragraphResponse = new TypedWebSocketResponse('PARAGRAPH', webSocketResponse);
    const paragraph = this._paragraphBuilder.paragraph(paragraphResponse.dataAsWebSocketPayload(), this._requestable);
    this._paragraphCollectionBehavior.update(paragraph);
  }

  private handleParagraphAddedResponse(webSocketResponse:WebSocketResponse):void{
    const paragraphAddedResponse = new TypedWebSocketResponse('PARAGRAPH_ADDED', webSocketResponse);
    const responseData = paragraphAddedResponse.dataAsWebSocketPayload();
    const paragraph = this._paragraphBuilder.paragraph(responseData.objectPropertyAsPayload('paragraph'), this._requestable);
    const index = responseData.numberProperty('index');
    this._paragraphCollectionBehavior.add(paragraph, index);
  }

  private handleParagraphRemovedResponse(webSocketResponse:WebSocketResponse):void{
    const paragraphRemovedResponse = new TypedWebSocketResponse('PARAGRAPH_REMOVED', webSocketResponse);
    const paragraphId  = paragraphRemovedResponse.dataAsWebSocketPayload().stringProperty('id');
    this._paragraphCollectionBehavior.remove(paragraphId);
  }
}
