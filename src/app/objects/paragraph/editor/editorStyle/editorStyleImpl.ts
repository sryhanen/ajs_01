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
import {EditorStyle} from './editorStyle';
import {computed, signal, Signal, WritableSignal} from '@angular/core';
import {RenderNode} from '../../../rendering/renderNode/renderNode';
import ace from 'ace-builds';
import {RenderNodeImpl} from '../../../rendering/renderNode/renderNodeImpl';
import {RegisteredComponents} from '../../../../ui/angular2+/componentRegistry/registeredComponents';
import {WebSocketPayload} from '../../../webSocket/webSocketPayload/webSocketPayload';
import {Requestable} from '../../../channel/requestable';
import {WebSocketResponse} from '../../../webSocket/response/webSocketResponse';
import {WebSocketResponseImpl} from '../../../webSocket/response/webSocketResponseImpl';
import {WebSocketPayloadImpl} from '../../../webSocket/webSocketPayload/webSocketPayloadImpl';

export class EditorStyleImpl implements EditorStyle {
  private readonly _editor:ace.Ace.Editor;
  private readonly _requestable:Requestable;
  private readonly _printSignal:Signal<RenderNode>;
  private readonly _currentFontSize:WritableSignal<number>;
  private readonly _displayLineNumbers:WritableSignal<boolean>;
  private readonly _responseEvents:Readonly<Record<string, (webSocketResponse:WebSocketResponse) => void>>;

  constructor(editor:ace.Ace.Editor,
              requestable:Requestable,
              paragraphState:WebSocketPayload,
              fontSizeOptions:number[] = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
  ) {
    this._editor = editor;
    this._requestable = requestable;
    const config = paragraphState.objectPropertyAsPayload('config');
    this._currentFontSize = signal(config.numberProperty('fontSize'));
    this._displayLineNumbers = signal(config.booleanProperty('lineNumbers'));
    this._printSignal = signal(new RenderNodeImpl(RegisteredComponents.EDITOR_STYLE_VIEW, computed(() => ({
      fontSizeOptions:fontSizeOptions,
      currentFontSize:this._currentFontSize(),
      displayLineNumbers:this._displayLineNumbers(),
      editorStyle:this
    }))));
    this._responseEvents = {
      'EDITOR_FONT_SIZE': (webSocketResponse:WebSocketResponse) => this.applyFontSize(webSocketResponse.dataAsWebSocketPayload().numberProperty('fontSize')),
      'EDITOR_LINE_NUMBER_VISIBILITY': (webSocketResponse:WebSocketResponse) => this.applyLineNumberVisibility(webSocketResponse.dataAsWebSocketPayload().booleanProperty('lineNumbers')),
    };
  }

  private applyFontSize(fontSize: number):void{
    this._editor.setFontSize(fontSize);
    this._currentFontSize.set(fontSize);
  }

  updateFontSize(fontSize: number): void {
    this.applyFontSize(fontSize);
    if(this._currentFontSize() !== fontSize){
      this._requestable.request({
        op:'EDITOR_FONT_SIZE',
        data:{
          size:fontSize
        }
      });
    }
  }

  private applyLineNumberVisibility(isVisible:boolean):void{
    this._editor.renderer.setShowGutter(isVisible);
    this._displayLineNumbers.set(isVisible);
  }

  updateLineNumberVisibility(isVisible: boolean): void {
    this.applyLineNumberVisibility(isVisible);
    if(this._displayLineNumbers() !== isVisible){
      this._requestable.request({
        op:'EDITOR_LINE_NUMBER_VISIBILITY',
        data:{
          isVisible:isVisible
        }
      });
    }
  }

  print(): Signal<RenderNode> {
    return this._printSignal;
  }

  response(json: object): void {
    const webSocketResponse = new WebSocketResponseImpl(new WebSocketPayloadImpl(json));
    const eventId= webSocketResponse.operation();
    if(eventId in this._responseEvents){
      this._responseEvents[eventId](webSocketResponse);
    }
  }
}
