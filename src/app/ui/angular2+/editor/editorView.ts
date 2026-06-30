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
import {AfterViewInit, Component, ElementRef, inject, input, ViewChild} from '@angular/core';
import {EditorWithStateBroadcastOnFocusImpl} from '../../angularJs/editorWithStateBroadcastOnFocus/editorWithStateBroadcastOnFocusImpl';
import {ChannelNode} from '../../../objects/channel/channelNode/channelNode';
import {CustomCompleterImpl} from '../../../objects/editor/customCompleter/customCompleterImpl';
import ace from 'ace-builds';
import {TextConfiguration} from '../../../objects/editor/configuration/text/textConfiguration';
import {LinesConfiguration} from '../../../objects/editor/configuration/lines/linesConfiguration';
import {KeyCommandsConfiguration} from '../../../objects/editor/configuration/keyCommands/keyCommandsConfiguration';
import {HighlightsConfiguration} from '../../../objects/editor/configuration/highlights/highLightsConfiguration';
import {AutoCommitConfiguration} from '../../../objects/editor/configuration/autoCommit/autoCommitConfiguration';
import {AnnotationsConfiguration} from '../../../objects/editor/configuration/annotations/annotationsConfiguration';
import {
  AutoCompletionConfigurationImpl
} from '../../../objects/editor/configuration/autoCompletion/autoCompletionConfigurationImpl';

@Component({
  selector: 'editor-view',
  template: `
    <pre class="editor-container" #anchor></pre>
  `,
})
export class EditorView implements AfterViewInit{
  paragraphData = input.required<object>();
  channelNode = input.required<ChannelNode>();
  @ViewChild('anchor') anchor: ElementRef;
  private editorWithStateBroadcastOnFocus = inject(EditorWithStateBroadcastOnFocusImpl);

  ngAfterViewInit(): void {
    this.setBasePath();
    const editor =
      new TextConfiguration(this.paragraphData(),
        new LinesConfiguration(this.paragraphData(),
          new KeyCommandsConfiguration(
            new HighlightsConfiguration(
              new AutoCommitConfiguration(this.channelNode(),
                new AnnotationsConfiguration(
                ))))))
      .configuredEditor(ace.edit(this.anchor.nativeElement));

    this.configureReadOnly(editor);
    const customCompleter = new CustomCompleterImpl(this.channelNode(), editor);
    this.channelNode().addRespondable(customCompleter);
    const editorWithAutoCompletions = new AutoCompletionConfigurationImpl(customCompleter);
    this.editorWithStateBroadcastOnFocus.editor(editorWithAutoCompletions.configuredEditor(editor), this.paragraphData()['id']);
  }

  private configureReadOnly(aceEditor: ace.Editor):void{
    const status = this.paragraphData()['status'];
    const editorIsDisabled = status === 'RUNNING' || status === 'PENDING';
    aceEditor.setReadOnly(editorIsDisabled);
    aceEditor.setStyle('paragraph-disable', editorIsDisabled);
  }

  private setBasePath(): void {
    ace.config.set('basePath', '/');
    ace.config.set('modePath', '/');
    ace.config.set('themePath', '/');
    ace.config.set('workerPath', '/');
  }
}
