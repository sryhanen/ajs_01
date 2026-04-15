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
import ace from 'ace-builds';
import {
  AfterViewInit,
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import {Editor} from './editor';
import {ConfiguredEditor} from './configuration/configuredEditor';
import {EditorCompletionsImpl} from './completions/editorCompletionsImpl';
import {WebsocketMessageService} from '../shared/components/websocket/websocket-message.service';
import {WsMessageListener} from '../shared/components/websocket/wsMessageListener';
import {WsMessageListenerImpl} from '../shared/components/websocket/wsMessageListenerImpl';
import {DefaultConfigurationImpl} from './configuration/defaultConfigurationImpl';

@Component({
  selector: 'editor',
  template: `
    <pre class="editor-container" [id]='editorId'></pre>
  `,
})
export class EditorComponent implements Editor, AfterViewInit{
  private _websocketMessageService = inject(WebsocketMessageService);
  private _wsMessageListenerService: WsMessageListener = inject(WsMessageListenerImpl);
  private _editor: ConfiguredEditor;

  ngAfterViewInit() {
    const editor = ace.edit(this.editorId);
    editor.setValue(this.editorContent);
    const editorCompletions = new EditorCompletionsImpl(this.editorId, this._wsMessageListenerService, this._websocketMessageService);
    this._editor = new DefaultConfigurationImpl(editor, this.changedContent, editorCompletions, this.onEditorFocus).apply();
  }

  @Input({ required: true }) editorId: string;

  @Input() editorContent: string;

  @Input()
  set showGutter(value:boolean) {
    if(this._editor){
      this._editor.lineNumbers(value);
    }
  };

  @Input()
  set fontSize(value: number){
    if(this._editor){
      this._editor.setFontSize(value);
    }
  }

  @Input()
  set disableEdit(value:boolean) {
    if(this._editor){
      this._editor.readonly(value);
    }
  }

  @Output() changedContent = new EventEmitter<string>();

  @Output() onEditorFocus = new EventEmitter<boolean>();
}

