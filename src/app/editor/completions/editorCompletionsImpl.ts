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
import {WsMessageListener} from '../../shared/components/websocket/wsMessageListener';
import {EditorCompletions} from './editorCompletions';

export class EditorCompletionsImpl implements EditorCompletions {
  private _websocketMessageService;
  private _wsMessageListenerService:WsMessageListener;
  private readonly _paragraphId:string;

  constructor(paragraphId: string, wsMessageListenerService:WsMessageListener, websocketMessageService) {
    this._paragraphId = paragraphId;
    this._wsMessageListenerService = wsMessageListenerService;
    this._websocketMessageService = websocketMessageService;
  }

  async language(editorLanguage: string): Promise<string> {
    this._websocketMessageService.getEditorSetting(this._paragraphId, editorLanguage);
    const editorSettings = await this._wsMessageListenerService.expectMessage('EDITOR_SETTINGS') as {editor:{completionKey:string, completionSupport:boolean, editorOnDblClick:boolean, language:string}};
    return`ace/mode/${editorSettings.editor.language}`;
  }

  async remoteCompleter(queryText:string): Promise<ace.Ace.Completer> {
    this._websocketMessageService.completion(this._paragraphId, queryText, queryText.length);
    const data = await this._wsMessageListenerService.expectMessage('COMPLETION_LIST') as {completions: {name:string, value:string}[]};
    const completions: ace.Ace.Completion[] = data.completions.map(function(completion) {
      return {
        name: completion.name,
        value: completion.value,
        score: 300,
      };
    });

    return {
      getCompletions: function(editor, session, pos, prefix, callback) {
        callback(null, completions);
      }
    };
  }

}
