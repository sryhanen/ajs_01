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
import {FontSize} from './fontSize';
import {computed, signal, Signal, WritableSignal} from '@angular/core';
import {RenderNode} from '../../../../rendering/renderNode/renderNode';
import {Requestable} from '../../../../channel/requestable';
import ace from 'ace-builds';
import {WebSocketPayload} from '../../../../webSocket/webSocketPayload/webSocketPayload';
import {RegisteredComponents} from '../../../../../ui/angular2+/componentRegistry/registeredComponents';
import {RenderNodeImpl} from '../../../../rendering/renderNode/renderNodeImpl';
import {WebSocketResponseImpl} from '../../../../webSocket/response/webSocketResponseImpl';
import {WebSocketPayloadImpl} from '../../../../webSocket/webSocketPayload/webSocketPayloadImpl';

export class FontSizeImpl implements FontSize {
  private readonly _requestable:Requestable;
  private readonly _editor:ace.Ace.Editor;
  private readonly _fontSize:WritableSignal<number>;
  private readonly _renderNode:Signal<RenderNode>;

  constructor(requestable:Requestable, editor:ace.Ace.Editor, paragraphPayload:WebSocketPayload) {
    this._requestable = requestable;
    this._editor = editor;
    const defaultFontSize = 12;
    const config = paragraphPayload.objectPropertyAsPayload('config');
    const fontSizeValue = config.propertyExists('fontSize') ? config.numberProperty('fontSize') : defaultFontSize;
    this._fontSize = signal(fontSizeValue);
    this._renderNode = signal(new RenderNodeImpl(RegisteredComponents.EDITOR_FONT_SIZE_SELECT_VIEW, computed(() => ({
      fontSize:this
    }))));
  }

  response(json: object): void {
    const webSocketResponse = new WebSocketResponseImpl(new WebSocketPayloadImpl(json));
    if(webSocketResponse.operation() === 'EDITOR_FONT_SIZE'){
      const fontSize = webSocketResponse.dataAsWebSocketPayload().numberProperty('fontSize');
      this._fontSize.set(fontSize);
    }
  }

  asSignal(): Signal<number> {
    return this._fontSize;
  }

  print(): Signal<RenderNode> {
    return this._renderNode;
  }

  update(fontSize: number): void {
    this._fontSize.set(fontSize);
    this._editor.setFontSize(fontSize);
    this._requestable.request({
      op:'EDITOR_FONT_SIZE',
      data:{
        paragraphId:'',
        fontSize:fontSize,
      }
    });
  }
}
