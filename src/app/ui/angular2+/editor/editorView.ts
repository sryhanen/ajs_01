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
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  ViewChild
} from '@angular/core';
import ace from 'ace-builds';
import {EditorConfiguration} from '../../../objects/editor/editorConfiguration';
import {AceCustomCompleter} from '../../../objects/editor/aceCustomCompleter/aceCustomCompleter';
import {AceCustomCompleterImpl} from '../../../objects/editor/aceCustomCompleter/aceCustomCompleterImpl';
import {Requestable} from '../../../objects/channel/requestable';

@Component({
  selector: 'editor',
  template: `
    <div class="paragraph-editor">
      <pre #editorAnchor class="editor-container"></pre>
    </div>
  `
})
export class EditorView implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('editorAnchor') editorAnchor: ElementRef;
  requestable = input.required<Requestable>();
  editorConfiguration = input.required<EditorConfiguration>();
  completions = input<ace.Ace.Completion[]>([]);
  editorLanguage = input<string>('ace/mode/text');

  private _aceEditor: ace.Ace.Editor;
  private _aceCustomCompleter:Signal<AceCustomCompleter>;
  private _aceLangTools;

  private _completionsChanged = effect(() => {
    this._aceCustomCompleter().applyCompletions(this.completions());
  });

  private _languageChanged = effect(() => {
    if(this._aceEditor) {
      this._aceEditor.getSession().setMode(this.editorLanguage());
    }
  });

  ngOnInit() {
    this._aceCustomCompleter = signal(new AceCustomCompleterImpl());
    this._aceLangTools = ace.require('ace/ext/language_tools');
  }

  ngAfterViewInit() {
    this._aceEditor = ace.edit(this.editorAnchor.nativeElement);
    this.configureEditor(this._aceEditor, this.editorConfiguration());
  }

  ngOnDestroy() {
    this._aceEditor.destroy();
  }

  private configureEditor(editor:ace.Editor, editorConfiguration:EditorConfiguration):void{
    editor.setFontSize(editorConfiguration.fontSize);
    editor.setValue(editorConfiguration.editorValue);
    editor.clearSelection();
    editor.setReadOnly(editorConfiguration.disableEditor);
    if(editorConfiguration.disableEditor){
      editor.setStyle('paragraph-disable');
    }

    editor.renderer.setShowGutter(editorConfiguration.showLineNumbers);
    editor.setShowFoldWidgets(false);
    editor.getSession().setUseWrapMode(true);

    editor.setOptions({
      maxLines: 30,
      enableBasicAutocompletion: true,
    });

    editor.commands.bindKey('tab', 'startAutocomplete');
    editor.commands.bindKey('ctrl-space', null);
    editor.commands.removeCommand('showSettingsMenu');
    editor.commands.removeCommand('find');
    editor.commands.removeCommand('replace');
    editor.setHighlightActiveLine(false);
    editor.setHighlightGutterLine(false);
    editor.on('blur', () => {
      editor.setHighlightActiveLine(false);
      editor.setHighlightGutterLine(false);
    });
    editor.on('focus', () => {
      editor.setHighlightActiveLine(true);
      editor.setHighlightGutterLine(true);
    });

    const keyWordCompleter = this._aceLangTools.keyWordCompleter;
    const snippetCompleter = this._aceLangTools.snippetCompleter;
    const textCompleter = this._aceLangTools.textCompleter;
    this._aceLangTools.setCompleters([this._aceCustomCompleter(), keyWordCompleter, snippetCompleter, textCompleter]);
    editor.commands.on('exec', (eventData)=> {
      if(eventData.command.name === 'startAutocomplete') {
        // request completions this._customCompleter.requestCompletions(aceEditor.getValue());
      }
    });
    editor.on('change', (delta:ace.Ace.Delta)=> {
      if(delta.start.row === 0) {
        // request editor setting this._customCompleter.requestEditorSetting(aceEditor.getValue());
      }
    });
    editor.on('change', () => {
      const commitParagraphRequest = {
        op:'COMMIT_PARAGRAPH',
        data:{
          id: '',
          noteId: '',
          title: '',
          paragraph: editor.getValue(),
          config: '',
          params: '',
        }
      };
      this.requestable().request(commitParagraphRequest);
    });
    editor.on('change', (delta:ace.Ace.Delta)=> {
      const timeConsumingQuery = editor.find(/index\s*=\s*("\*"|\*)(\s|\||$)/);
      if(timeConsumingQuery){
        editor.getSession().setAnnotations([
          {
            row:timeConsumingQuery.start.row,
            column:timeConsumingQuery.start.column,
            text: 'The search query "index=*" can be time-consuming. Please consider using date-range filters to narrow down your search.',
            type: 'error'
          }
        ]);
      }
      else{
        editor.getSession().setAnnotations([]);
      }
    });
    const requestable = this.requestable();
    editor.commands.addCommand({
      name: 'Run paragraph',
      bindKey: {
        win: 'Shift-Enter',
        mac: 'Shift-Enter'
      },
      exec: function() {
        requestable.request({op:'RUN_PARAGRAPH',
          data: {
            id: '',
            paragraph: '',
            config: {},
            params: {},
          },
        });
      }
    });
  }
}
