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
import ace from 'ace-builds';
import {Channel} from '../channel/channel';
import {EditorWithAutoCompletionImpl} from './configuredEditor/editorWithAutoCompletion/editorWithAutoCompletionImpl';
import {EditorWithHighlights} from './configuredEditor/editorWithHighlights/editorWithHighlights';
import {EditorWithKeyCommands} from './configuredEditor/editorWithKeyCommands/editorWithKeyCommands';
import {EditorWithAutoCommit} from './configuredEditor/editorWithAutoCommit/editorWithAutoCommit';
import {EditorWithAnnotations} from './configuredEditor/editorWithAnnotations/editorWithAnnotations';
import {EditorWithParagraphConfiguration} from './configuredEditor/editorWithParagraphConfiguration/editorWithParagraphConfiguration';
import {EditorWithLineWrapping} from './configuredEditor/editorWithLineWrapping/editorWithLineWrapping';
import {ParagraphData} from '../paragraph/paragraphData/paragraphData';
import {AceCustomCompleter} from './configuredEditor/editorWithAutoCompletion/aceCustomCompleter/aceCustomCompleter';
import {AceCustomCompleterImpl} from './configuredEditor/editorWithAutoCompletion/aceCustomCompleter/aceCustomCompleterImpl';
import {AceCustomCompleterStub} from './configuredEditor/editorWithAutoCompletion/aceCustomCompleter/aceCustomCompleterStub';

export class EditorImpl implements Editor, Channel{
  private readonly _channel:Channel;
  private readonly _paragraphData: ParagraphData;
  private _aceCustomCompleter: AceCustomCompleter;
  private _editor: ace.Editor;

  constructor(channel:Channel, paragraphData: ParagraphData) {
    this._channel = channel;
    this._paragraphData = paragraphData;
    this._aceCustomCompleter = new AceCustomCompleterStub();
  }

  response(data: object) {
    if(!this._aceCustomCompleter.isStub()) {
      this._aceCustomCompleter.response(data);
    }
  }

  request(data: object) {
    this._channel.request(data);
  }

  editorReference(): ace.Editor {
    return this._editor;
  }

  initialize(htmlElement:HTMLElement): void{
    this.setBasePath();
    const paragraphId:string = this._paragraphData.id();
    const editor = ace.edit(htmlElement);
    this._aceCustomCompleter = new AceCustomCompleterImpl(this, paragraphId, editor.getSession());
    const configuredEditor =
      new EditorWithAutoCompletionImpl(
        new EditorWithLineWrapping(
          new EditorWithAutoCommit(
            new EditorWithAnnotations(
              new EditorWithKeyCommands(
                new EditorWithHighlights(
                  new EditorWithParagraphConfiguration(
                    editor, this._paragraphData
                  ).aceEditor()
                ).aceEditor()
              ).aceEditor()
            ).aceEditor(), this, this._paragraphData
          ).aceEditor()
        ).aceEditor(), this._aceCustomCompleter);
    this._editor = configuredEditor.aceEditor();
  }

  private setBasePath(): void {
    ace.config.set('basePath', '/');
    ace.config.set('modePath', '/');
    ace.config.set('themePath', '/');
    ace.config.set('workerPath', '/');
  }
}
