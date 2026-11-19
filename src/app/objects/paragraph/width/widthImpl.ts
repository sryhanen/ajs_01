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
import {Width} from './width';
import {computed, signal, Signal, WritableSignal} from '@angular/core';
import {RenderNode} from '../../rendering/renderNode/renderNode';
import {Requestable} from '../../channel/requestable';
import {WebSocketPayload} from '../../webSocket/webSocketPayload/webSocketPayload';
import {RenderNodeImpl} from '../../rendering/renderNode/renderNodeImpl';
import {RegisteredComponents} from '../../../ui/angular2+/componentRegistry/registeredComponents';
import {WebSocketResponseImpl} from '../../webSocket/response/webSocketResponseImpl';
import {WebSocketPayloadImpl} from '../../webSocket/webSocketPayload/webSocketPayloadImpl';

export class WidthImpl implements Width {
  private readonly _requestable:Requestable;
  private readonly _selector:RenderNode;
  private readonly _currentWidth:WritableSignal<number>;

  constructor(requestable:Requestable, paragraphState:WebSocketPayload) {
    this._requestable = requestable;
    const width = paragraphState.objectPropertyAsPayload('config').numberProperty('colWidth');
    this._currentWidth = signal(width);
    this._selector = new RenderNodeImpl(RegisteredComponents.WIDTH_SELECT_VIEW, computed(() => ({
      currentWidth: this._currentWidth(),
      selectWidthCallback: (width:number) => this.updateWidth(width),
    })));
  }

  currentWidth(): Signal<number> {
    return this._currentWidth;
  }

  response(json: object): void {
    const responseMessage = new WebSocketResponseImpl(new WebSocketPayloadImpl(json));
    if(responseMessage.operation() === 'PARAGRAPH_WIDTH'){
      const newWidth = responseMessage.dataAsWebSocketPayload().numberProperty('width');
      this._currentWidth.set(newWidth);
    }
  }

  selector(): RenderNode {
    return this._selector;
  }

  private updateWidth(width:number):void{
    this._currentWidth.set(width);
    this._requestable.request({
      op:'PARAGRAPH_WIDTH',
      data:{
        width:width,
      }
    });
  }
}
