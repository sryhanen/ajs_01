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
import {CustomCompleter} from './customCompleter';
import ace, {Ace} from 'ace-builds';
import {ResponseRegisterImpl} from '../../register/responseRegister/responseRegisterImpl';
import {ResponseRegister} from '../../register/responseRegister/responseRegister';
import {CompletionListMessageImpl} from '../../message/completionListMessage/completionListMessageImpl';
import {SafeJsonImpl} from '../../safeJson/safeJsonImpl';
import {MessageImpl} from '../../message/messageImpl';
import {EditorSettingMessageImpl} from '../../message/editorSettingMessage/editorSettingMessageImpl';
import {Requestable} from '../../channel/requestable';

export class CustomCompleterImpl implements CustomCompleter {
  private readonly _requestable:Requestable;
  private readonly _aceEditor: ace.Editor;
  private _aceEditorCallback: Ace.CompleterCallback;
  private readonly _responseRegister:ResponseRegister;

  constructor(requestable:Requestable, aceEditor:ace.Editor){
    this._requestable = requestable;
    this._aceEditor = aceEditor;
    this._aceEditorCallback = () => {};
    this._responseRegister = new ResponseRegisterImpl();
    this._responseRegister.register('EDITOR_SETTING', (json) => this.editorSettingResponse(json));
    this._responseRegister.register('COMPLETION_LIST', (json) => this.completionListResponse(json));
  }

  getCompletions(editor: ace.Editor, session: ace.EditSession, position: Ace.Point, prefix: string, callback: Ace.CompleterCallback): void{
    this._aceEditorCallback = callback;
  }

  requestCompletions(editorValue: string): void {
    const completionsRequest = {
      op: 'COMPLETION',
      data: {
        paragraphId: '', //This needs to be changed server side from id to paragraphId
        buf: editorValue,
        cursor: editorValue.length,
      },
    };
    this._requestable.request(completionsRequest);
  }

  requestEditorSetting(editorValue: string): void {
    const editorSettingRequest = {
      op:'EDITOR_SETTING',
      data:{
        paragraphId:'',
        paragraphText: editorValue
      }
    };
    this._requestable.request(editorSettingRequest);
  }

  response(json: object): void {
    this._responseRegister.response(json);
  }

  private completionListResponse(json:object):void {
    const completionListMessage = new CompletionListMessageImpl(new MessageImpl(new SafeJsonImpl(json)));
    this._aceEditorCallback(null, completionListMessage.completions());
  }

  private editorSettingResponse(json:object):void {
    const editorSettingMessage = new EditorSettingMessageImpl(new MessageImpl(new SafeJsonImpl(json)));
    const newMode = `ace/mode/${editorSettingMessage.language()}`;
    this._aceEditor.getSession().setMode(newMode);
  }
}
