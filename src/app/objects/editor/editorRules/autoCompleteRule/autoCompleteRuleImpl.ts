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
import ace, {Ace} from 'ace-builds';
import {Requestable} from '../../../channel/requestable';
import {DplCompleterImpl} from './dplCompleter/dplCompleterImpl';
import {DplCompleter} from './dplCompleter/dplCompleter';
import {AutoCompleteRule} from './autoCompleteRule';
import {EditorSettingMessageImpl} from '../../../message/editorSetting/editorSettingMessageImpl';
import {MessageImpl} from '../../../message/messageImpl';
import {WebSocketPayloadImpl} from '../../../webSocketPayload/webSocketPayloadImpl';

export class AutoCompleteRuleImpl implements AutoCompleteRule {
  private readonly _requestable:Requestable;
  private readonly _dplCompleter:DplCompleter;
  private readonly _aceLangTools;
  private _editor:Ace.Editor;

  constructor(requestable:Requestable) {
    this._requestable = requestable;
    this._dplCompleter = new DplCompleterImpl(requestable);
    this._aceLangTools = ace.require('ace/ext/language_tools');
  }

  response(json: object): void {
    const message = new MessageImpl(new WebSocketPayloadImpl(json));
    if(message.operation() === 'EDITOR_SETTING') {
      const editorSettingMessage = new EditorSettingMessageImpl(message);
      editorSettingMessage.setEditorLanguage(this);
    }
    else{
      this._dplCompleter.response(json);
    }
  }

  setEditorLanguage(language: string): void {
    if(!this._editor){
      throw new Error('Editor is undefined, can not set editor language.');
    }
    this._editor.getSession().setMode(language);
  }

  applyTo(editor: Ace.Editor): void {
    this._editor = editor;
    this.initializeCompleters();
    this.requestLanguageOnFirstRowChange(editor);
  }

  private requestLanguageOnFirstRowChange(editor:Ace.Editor):void{
    editor.on('change', (delta:ace.Ace.Delta)=> {
      if(delta.start.row === 0) {
        const editorValue = editor.getValue();
        this._requestable.request({
          op:'EDITOR_SETTING',
          data:{
            paragraphId:'',
            paragraphText: editorValue
          }
        });
      }
    });
  }

  private initializeCompleters():void {
    const keyWordCompleter = this._aceLangTools.keyWordCompleter;
    const snippetCompleter = this._aceLangTools.snippetCompleter;
    const textCompleter = this._aceLangTools.textCompleter;
    this._aceLangTools.setCompleters([this._dplCompleter, keyWordCompleter, snippetCompleter, textCompleter]);
  }
}
