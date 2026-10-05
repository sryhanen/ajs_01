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
import {Editor} from './editor';
import {computed, signal, Signal, WritableSignal} from '@angular/core';
import {RenderNode} from '../rendering/renderNode/renderNode';
import {Ace} from 'ace-builds';
import {Requestable} from '../channel/requestable';
import {EditorConfiguration} from './editorConfiguration';
import {RenderNodeImpl} from '../rendering/renderNode/renderNodeImpl';
import {RegisteredComponents} from '../../ui/angular2+/componentRegistry/registeredComponents';
import {Message} from '../message/message';
import {CompletionListMessageImpl} from '../message/completionList/completionListMessageImpl';
import {EditorSettingsMessageImpl} from '../message/editorSettings/editorSettingsMessageImpl';
import {WebSocketPayloadImpl} from '../webSocketPayload/webSocketPayloadImpl';
import {MessageImpl} from '../message/messageImpl';

export class EditorImpl implements Editor {
  private readonly _requestable:Requestable;
  private readonly _renderNode:Signal<RenderNode>;
  private readonly _completions:WritableSignal<Ace.Completion[]>;
  private readonly _language:WritableSignal<string>;
  private readonly _responseEvents: Map<string, (message:Message) => void>;

  constructor(requestable:Requestable, editorConfiguration:EditorConfiguration={disableEditor:false, fontSize:12, showLineNumbers:true}) {
    this._requestable = requestable;
    this._completions = signal([]);
    this._language = signal('');
    this._renderNode = signal(new RenderNodeImpl(RegisteredComponents.EDITOR_VIEW, computed(() => ({
      editorConfiguration: editorConfiguration,
      completions: this._completions(),
      editorLanguage: this._language(),
    }))));
    this._responseEvents = new Map([
      ['EDITOR_SETTING', (message) => this.editorSettingResponse(message)],
      ['COMPLETION_LIST', (message) => this.completionListResponse(message)],
    ]);
  }

  print(): Signal<RenderNode> {
    return this._renderNode;
  }

  request(json: object): void {
    this._requestable.request(json);
  }

  response(json: object): void {
    const message = new MessageImpl(new WebSocketPayloadImpl(json));
    const eventId = message.operation();
    if(this._responseEvents.has(eventId)){
      const event = this._responseEvents.get(eventId);
      event(message);
    }
  }

  applyCompletions(completions: Ace.Completion[]) {
    this._completions.set(completions);
  }

  setEditorLanguage(language: string): void {
    this._language.set(language);
  }

  private editorSettingResponse(message:Message): void {
    const editorSettingMessage = new EditorSettingsMessageImpl(message);
    editorSettingMessage.setEditorLanguage(this);
  }

  private completionListResponse(message:Message): void {
    const completionListMessage = new CompletionListMessageImpl(message);
    completionListMessage.applyCompletions(this);
  }
}
