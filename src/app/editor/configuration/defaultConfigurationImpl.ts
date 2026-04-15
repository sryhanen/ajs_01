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
import {ConfiguredEditor} from './configuredEditor';
import {EditorCompletions} from '../completions/editorCompletions';
import ace from 'ace-builds';
import {EventEmitter} from '@angular/core';
import {DefaultConfiguration} from './defaultConfiguration';
import {ConfiguredEditorImpl} from './configuredEditorImpl';


export class DefaultConfigurationImpl implements DefaultConfiguration {
  private readonly _editor: ace.Ace.Editor;
  private readonly _editorCompletions: EditorCompletions;
  private readonly _langTools = ace.require('ace/ext/language_tools');
  private _onChange: EventEmitter<string>;
  private _onEditorFocus: EventEmitter<boolean>;

  constructor(editor: ace.Ace.Editor, onChange: EventEmitter<string>, editorCompletions: EditorCompletions, onEditorFocus: EventEmitter<boolean>) {
    this._editor = editor;
    this._editorCompletions = editorCompletions;
    this._onEditorFocus = onEditorFocus;
    this._onChange = onChange;
  }

  apply(): ConfiguredEditor {
    this.configure();
    return new ConfiguredEditorImpl(this._editor);
  }

  private configure(): void {
    this.setListeners();
    this.setKeyCommands();
    this.setBasePath();
    this.setEditorHighlight(false);
    this._editor.setShowFoldWidgets(false);
    this._editor.getSession().setUseWrapMode(true);
    this._editor.setOptions({
      maxLines: 30,
      enableBasicAutocompletion: true,
    });
    this._editor.clearSelection();
  }

  private setBasePath(): void {
    ace.config.set('basePath', '/');
    ace.config.set('modePath', '/');
    ace.config.set('themePath', '/');
    ace.config.set('workerPath', '/');
  }

  private setEditorHighlight(value:boolean): void {
    this._editor.setHighlightActiveLine(value);
    this._editor.setHighlightGutterLine(value);
  }

  private setKeyCommands(): void {
    this._editor.commands.bindKey('tab', 'startAutocomplete');
    this._editor.commands.bindKey('ctrl-space', null);
    this._editor.commands.removeCommand('showSettingsMenu');
    this._editor.commands.removeCommand('find');
    this._editor.commands.removeCommand('replace');
  }

  private setListeners(): void {
    this._editor.on('blur', ()=> {
      this.setEditorHighlight(false);
      this._onEditorFocus.emit(false);
    });
    this._editor.on('focus', ()=> {
      this.setEditorHighlight(true);
      this._onEditorFocus.emit(true);
    });
    this._editor.commands.on('exec', async (eventData)=> {
      if(eventData.command.name === 'startAutocomplete') {
        const remoteCompleter = await this._editorCompletions.remoteCompleter(this._editor.getValue());
        this._langTools.setCompleters([remoteCompleter, this._langTools.keyWordCompleter, this._langTools.snippetCompleter, this._langTools.textCompleter]);
      }
    });
    this._editor.on('change', async (delta:ace.Ace.Delta)=> {
      this._onChange.emit(this._editor.getValue());
      if(delta.start.row === 0) {
        const language = await this._editorCompletions.language(this._editor.getValue());
        this._editor.getSession().setMode(language);
      }
      const timeConsumingQuery = this._editor.find(/index\s*=\s*("\*"|\*)(\s|\||$)/);
      if(timeConsumingQuery){
        this._editor.getSession().setAnnotations([
          {
            row:timeConsumingQuery.start.row,
            column:timeConsumingQuery.start.column,
            text: 'The search query "index=*" can be time-consuming. Please consider using date-range filters to narrow down your search.',
            type: 'error'
          }
        ]);
      }
      else{
        this._editor.getSession().setAnnotations([]);
      }
    });
  }
}
