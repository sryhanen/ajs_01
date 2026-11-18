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
import {RenderNode} from '../../rendering/renderNode/renderNode';
import {computed, Signal} from '@angular/core';
import {Paragraph} from '../paragraph';
import {Output} from '../../output/output';
import {Execution} from '../execution/execution';
import {Actions} from './actions';
import {RenderNodeImpl} from '../../rendering/renderNode/renderNodeImpl';
import {RegisteredComponents} from '../../../ui/angular2+/componentRegistry/registeredComponents';
import {Width} from '../width/width';

export class ActionsImpl implements Actions {
  private readonly _executor:Signal<RenderNode>;
  private readonly _executionStatus:RenderNode;
  private readonly _clearOutput: RenderNode;
  private readonly _copyParagraph:RenderNode;
  private readonly _paragraphLink:RenderNode;
  private readonly _removeParagraph:RenderNode;
  private readonly _toggleParagraphExecution:RenderNode;
  private readonly _selectWidth:RenderNode;

  constructor(
    execution:Execution,
    output:Output,
    paragraph:Paragraph,
    width:Width,
  ) {
    this._executor = execution.executor();
    this._executionStatus = execution.executionStatus();
    this._clearOutput = new RenderNodeImpl(RegisteredComponents.CLEAR_OUTPUT_VIEW, computed(() => ({
      clearOutputCallback:() => output.clear(),
      disable:execution.executionIsOngoing()()
    })));
    this._copyParagraph = new RenderNodeImpl(RegisteredComponents.COPY_PARAGRAPH_VIEW, computed(() => ({
      copyParagraphCallback: () => paragraph.request({
        op:'COPY_PARAGRAPH',
        data:{}
      }),
      disable:execution.executionIsOngoing()()
    })));
    this._paragraphLink = new RenderNodeImpl(RegisteredComponents.PARAGRAPH_LINK_VIEW, computed(() => ({
      paragraphId:paragraph.id()
    })));
    this._removeParagraph = new RenderNodeImpl(RegisteredComponents.REMOVE_PARAGRAPH_VIEW, computed(() => ({
      removeParagraphCallback:() => paragraph.request({
        op:'PARAGRAPH_REMOVE',
        data:{}
      }),
      disable:execution.executionIsOngoing()()
    })));
    this._toggleParagraphExecution = execution.toggler();
    this._selectWidth = width.selector();
  }

  actions(): {
    executor:Signal<RenderNode>,
    executionStatus:RenderNode,
    clearOutput:RenderNode,
    copyParagraph:RenderNode,
    paragraphLink:RenderNode,
    removeParagraph:RenderNode,
    toggleParagraphExecution:RenderNode,
    selectWidth:RenderNode,
  } {
    return {
      executor: this._executor,
      executionStatus:this._executionStatus,
      clearOutput: this._clearOutput,
      copyParagraph: this._copyParagraph,
      paragraphLink: this._paragraphLink,
      removeParagraph:this._removeParagraph,
      toggleParagraphExecution:this._toggleParagraphExecution,
      selectWidth:this._selectWidth,
    };
  }

}
