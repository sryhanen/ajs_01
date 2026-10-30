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
import {TreeNode} from '../../treeNode/treeNode';
import {WebSocketPayload} from '../../webSocket/webSocketPayload/webSocketPayload';
import {Requestable} from '../../channel/requestable';
import {TreeNodeBranchImpl} from '../../treeNode/treeNodeBranch/treeNodeBranchImpl';
import {ParagraphImpl} from '../paragraphImpl';
import {ParagraphRequest} from '../paragraphRequest/paragraphRequest';
import {OutputImpl} from '../../output/outputImpl';
import {TreeNodeImpl} from '../../treeNode/treeNodeImpl';
import {computed, signal} from '@angular/core';
import {RenderNodeImpl} from '../../rendering/renderNode/renderNodeImpl';
import {RegisteredComponents} from '../../../ui/angular2+/componentRegistry/registeredComponents';
import {Output} from '../../output/output';
import {ParagraphTreeNodeBuilder} from './paragraphTreeNodeBuilder';

export class ParagraphTreeNodeBuilderImpl implements ParagraphTreeNodeBuilder {

  paragraphTreeNode(paragraphState:WebSocketPayload, requestable:Requestable):TreeNode{
    const paragraphBranch = new TreeNodeBranchImpl();
    const paragraph = new ParagraphImpl(requestable, paragraphState, paragraphBranch);
    const paragraphId = paragraphState.stringProperty('id');
    const paragraphRequest = new ParagraphRequest(requestable, paragraphId);
    const output = new OutputImpl(paragraphRequest);
    const outputNode = new TreeNodeImpl(paragraphRequest, output, output.print(), 'output');
    paragraphBranch.add(outputNode, 0);
    this.createOutputResponseIfOutputExists(paragraphState, output);
    const paragraphView = signal(new RenderNodeImpl(RegisteredComponents.PARAGRAPH_VIEW, computed(() => ({
      ...paragraphBranch.nodes()(),
      paragraphId:paragraphId
    }))));
    return new TreeNodeImpl(paragraphRequest, paragraph, paragraphView, paragraphId);
  }

  private createOutputResponseIfOutputExists(paragraphState: WebSocketPayload, output:Output):void{
    if (paragraphState.propertyExists('output')) {
      const paragraphOutput = paragraphState.objectProperty('output');
      if (paragraphOutput['data'] === undefined || paragraphOutput['type'] === undefined) {
        console.error(`Output data not processed, format invalid: ${JSON.stringify(paragraphOutput)}`);
      } else {
        const paragraphOutputResponse = {
          op: 'PARAGRAPH_OUTPUT',
          data: {
            noteId: '',
            paragraphId: paragraphState.stringProperty('id'),
            output: paragraphOutput,
          }
        };
        output.response(paragraphOutputResponse);
      }
    }
  }
}
