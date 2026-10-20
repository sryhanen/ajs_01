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
import {ParagraphViewMode} from './paragraphViewMode';
import {computed, signal, Signal, WritableSignal} from '@angular/core';
import {RenderNode} from '../../rendering/renderNode/renderNode';
import {Output} from '../../output/output';
import {Editor} from '../../editor/editor';
import {RenderNodeImpl} from '../../rendering/renderNode/renderNodeImpl';
import {RegisteredComponents} from '../../../ui/angular2+/componentRegistry/registeredComponents';
import {Paragraph} from '../paragraph';
import {WebSocketPayload} from '../../webSocket/webSocketPayload/webSocketPayload';
import {RenderNodeStub} from '../../rendering/renderNode/renderNodeStub';
import {ParagraphViewInputs} from '../paragraphViewInputs';
import {ParagraphTitleImpl} from '../paragraphTitle/paragraphTitleImpl';
import {ParagraphViewModeControlsViewInputs} from './paragraphViewModeControlsViewInputs';

export class ParagraphViewModeImpl implements ParagraphViewMode {
  private readonly _paragraphPayload: WebSocketPayload;
  private readonly _paragraph:Paragraph;
  private readonly _editor: Editor;
  private readonly _output: Output;
  private readonly _titleIsVisible:WritableSignal<boolean>;
  private readonly _outputIsVisible:WritableSignal<boolean>;
  private readonly _editorIsVisible:WritableSignal<boolean>;
  private readonly _lineNumbersAreVisible:WritableSignal<boolean>;
  private readonly _renderNodeStub: RenderNode;
  private readonly _renderNode: Signal<RenderNode<ParagraphViewInputs>>;

  constructor(paragraphPayload: WebSocketPayload, paragraph:Paragraph, editor: Editor, output: Output) {
    this._paragraphPayload = paragraphPayload;
    this._paragraph = paragraph;
    this._editor = editor;
    this._output = output;
    const paragraphConfig = paragraphPayload.objectPropertyAsPayload('config');
    this._titleIsVisible = signal(paragraphConfig.propertyExists('title') ? paragraphConfig.booleanProperty('title'): false);
    this._outputIsVisible = signal(paragraphConfig.propertyExists('tableHide') ? !paragraphConfig.booleanProperty('tableHide'): true);
    this._editorIsVisible = signal(paragraphConfig.propertyExists('editorHide') ? !paragraphConfig.booleanProperty('editorHide'): true);
    this._lineNumbersAreVisible = signal(paragraphConfig.propertyExists('lineNumbers')? paragraphConfig.booleanProperty('lineNumbers'): true);
    this._renderNodeStub = new RenderNodeStub();
    this._renderNode = this.initializeRenderNode();
  }

  print(): Signal<RenderNode<ParagraphViewInputs>> {
    return this._renderNode;
  }

  toggleEditor(shouldDisplay: boolean): void {
    this._editorIsVisible.set(shouldDisplay);
    this._paragraph.request({
      op:'TOGGLE_EDITOR',
      data:{
        paragraphId:'',
        editorIsVisible:shouldDisplay
      }
    });
  }

  toggleLineNumbers(shouldDisplay: boolean): void {
    this._lineNumbersAreVisible.set(shouldDisplay);
    this._paragraph.request({
      op:'TOGGLE_LINE_NUMBERS',
      data:{
        paragraphId:'',
        lineNumbersAreVisible:shouldDisplay
      }
    });
  }

  toggleOutput(shouldDisplay: boolean): void {
    this._outputIsVisible.set(shouldDisplay);
    this._paragraph.request({
      op:'TOGGLE_OUTPUT',
      data:{
        paragraphId:'',
        outputIsVisible:shouldDisplay
      }
    });
  }

  toggleTitle(shouldDisplay: boolean): void {
    this._titleIsVisible.set(shouldDisplay);
    this._paragraph.request({
      op:'TOGGLE_TITLE',
      data:{
        paragraphId:'',
        titleIsVisible:shouldDisplay
      }
    });
  }

  private initializeRenderNode(): Signal<RenderNode<ParagraphViewInputs>> {
    const paragraphViewModeControls:RenderNode<ParagraphViewModeControlsViewInputs> = new RenderNodeImpl(RegisteredComponents.PARAGRAPH_VIEW_MODE_CONTROLS_VIEW, computed(() => ({
      paragraphViewMode: this,
      editorIsVisible: this._editorIsVisible(),
      outputIsVisible: this._outputIsVisible(),
      titleIsVisible: this._titleIsVisible(),
      lineNumbersAreVisible: this._lineNumbersAreVisible(),
    })));

    return signal(new RenderNodeImpl(RegisteredComponents.PARAGRAPH_VIEW, computed(() => ({
      paragraphViewModeControls: paragraphViewModeControls,
      paragraphTitle: this._titleIsVisible() ? new ParagraphTitleImpl(this._paragraphPayload.stringProperty('title'), this._paragraph).print()() : this._renderNodeStub,
      output: this._outputIsVisible() ? this._output.print()() : this._renderNodeStub,
      editor: this._editorIsVisible() ? this._editor.print()() : this._renderNodeStub,
    }))));
  }
}
