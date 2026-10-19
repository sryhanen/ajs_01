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
import {computed, signal, Signal} from '@angular/core';
import {RenderNode} from '../../rendering/renderNode/renderNode';
import {Output} from '../../output/output';
import {Editor} from '../../editor/editor';
import {RenderNodeImpl} from '../../rendering/renderNode/renderNodeImpl';
import {RegisteredComponents} from '../../../ui/angular2+/componentRegistry/registeredComponents';
import {Paragraph} from '../paragraph';
import {WebSocketPayload} from '../../webSocket/webSocketPayload/webSocketPayload';
import {RenderNodeStub} from '../../rendering/renderNode/renderNodeStub';

export class ParagraphViewModeImpl implements ParagraphViewMode {
  private readonly _paragraphPayload: WebSocketPayload;
  private readonly _paragraph:Paragraph;
  private readonly _editor: Editor;
  private readonly _output: Output;
  private readonly _renderNodeStub: RenderNode;
  private readonly _renderNode: Signal<RenderNode>;

  constructor(paragraphPayload: WebSocketPayload, paragraph:Paragraph, editor: Editor, output: Output) {
    this._paragraphPayload = paragraphPayload;
    this._paragraph = paragraph;
    this._editor = editor;
    this._output = output;
    this._renderNodeStub = new RenderNodeStub();
    this._renderNode = this.initializeRenderNode();
  }

  print(): Signal<RenderNode> {
    return this._renderNode;
  }

  toggleEditor(shouldDisplay: boolean): void {
  }

  toggleLineNumbers(shouldDisplay: boolean): void {
  }

  toggleOutput(shouldDisplay: boolean): void {
  }

  toggleTitle(shouldDisplay: boolean): void {
  }

  private initializeRenderNode(): Signal<RenderNode> {
    return signal(new RenderNodeImpl(RegisteredComponents.PARAGRAPH_VIEW, computed(() => ({
      title:'',
      output:this._output.print()(),
      editor:this._editor.print()(),
    }))));
  }
}
