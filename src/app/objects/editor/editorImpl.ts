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
import {computed, signal, Signal} from '@angular/core';
import {RenderNode} from '../rendering/renderNode/renderNode';
import {Channel} from '../channel/channel';
import {ComponentView} from '../rendering/componentView/componentView';
import {ComponentViewImpl} from '../rendering/componentView/componentViewImpl';
import {EditorView} from '../../ui/angular2+/editor/editorView';
import ace from 'ace-builds';
import {CustomCompleter} from './customCompleter/customCompleter';
import {AceEditorConfiguration} from './configuration/aceEditorConfiguration';
import {TextConfiguration} from './configuration/text/textConfiguration';
import {LinesConfiguration} from './configuration/lines/linesConfiguration';
import {KeyCommandsConfiguration} from './configuration/keyCommands/keyCommandsConfiguration';
import {HighlightsConfiguration} from './configuration/highlights/highLightsConfiguration';
import {AutoCommitConfiguration} from './configuration/autoCommit/autoCommitConfiguration';
import {AnnotationsConfiguration} from './configuration/annotations/annotationsConfiguration';
import {ReadOnlyConfiguration} from './configuration/readonly/readOnlyConfiguration';
import {AutoCompletionConfigurationImpl} from './configuration/autoCompletion/autoCompletionConfigurationImpl';
import {CustomCompleterImpl} from './customCompleter/customCompleterImpl';

export class EditorImpl implements Editor {
  private readonly _channel:Channel;
  private readonly _componentView:ComponentView;
  private readonly _paragraphId:string;
  private readonly _aceEditor: ace.Editor;
  private readonly _customCompleter:CustomCompleter;

  constructor(channel:Channel, paragraphData: object) {
    this._channel = channel;
    this._paragraphId = paragraphData['id'];
    this._aceEditor = this.initializedAceEditor();
    this._customCompleter = new CustomCompleterImpl(this, this._aceEditor);
    this._componentView = new ComponentViewImpl(EditorView, signal({paragraphId: this._paragraphId, editor: this._aceEditor, editorConfigurationRules: this.configurationRules(paragraphData, this._customCompleter)}));
  }

  private initializedAceEditor(): ace.Editor {
    this.setBasePath();
    const preElement = document.createElement('pre');
    preElement.classList.add('editor-container');
    return ace.edit(preElement);
  }

  print(): Signal<RenderNode> {
    return computed(() => ({
      paragraphId:this._paragraphId,
      children: signal([]),
      componentView:this._componentView
    }));
  }

  request(json: object): void {
    this._channel.request(json);
  }

  response(json: object): void {
    this._customCompleter.response(json);
  }

  private configurationRules(paragraphData:object, customCompleter:CustomCompleter):AceEditorConfiguration[] {
    return [
      new TextConfiguration(paragraphData),
      new LinesConfiguration(paragraphData),
      new KeyCommandsConfiguration(),
      new HighlightsConfiguration(),
      new AutoCommitConfiguration(this),
      new AnnotationsConfiguration(),
      new ReadOnlyConfiguration(paragraphData),
      new AutoCompletionConfigurationImpl(customCompleter)
    ];
  }

  private setBasePath(): void {
    ace.config.set('basePath', '/');
    ace.config.set('modePath', '/');
    ace.config.set('themePath', '/');
    ace.config.set('workerPath', '/');
  }
}
