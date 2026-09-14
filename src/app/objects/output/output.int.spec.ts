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
import {Channel} from '../channel/channel';
import {Output} from './output';
import {Mock} from 'vitest';
import {FakeChannel} from '../channel/fakeChannel';
import {OutputImpl} from './outputImpl';
import {OutputType} from './outputType';
import {RegisteredComponents} from '../../ui/angular2+/componentRegistry/registeredComponents';
import {RenderNode} from '../rendering/renderNode/renderNode';

describe('Output integration test', () => {
  let channel:Channel;
  let output:Output;
  let requestSpy:Mock;

  beforeEach(() => {
    channel = new FakeChannel();
    output = new OutputImpl(channel);
    requestSpy = vi.spyOn(channel, 'request');
  });

  describe('Paragraph output switching', () => {
    const textOutputType = OutputType.text;
    const paragraphOutputRequest = {
      op:'PARAGRAPH_OUTPUT_REQUEST',
      data:{
        type:textOutputType
      }
    };
    beforeEach(() => {
      output.request(paragraphOutputRequest);
    });

    it('Should have pending switch', () => {
      const outputSwitcherRenderNode = output.print()().inputs()()['outputSwitcher'] as RenderNode;
      expect(outputSwitcherRenderNode.inputs()()['switchIsPending']).toBe(true);
    });

    it('Should have stub output formats', () => {
      const outputFormatsRenderNode = output.print()().inputs()()['outputFormats']  as RenderNode[];
      const stubFormats = outputFormatsRenderNode.filter(outputFormat => outputFormat.isStub());
      expect(stubFormats).toHaveLength(5);
    });

    it('Should create output switch request', () => {
      const paragraphOutputResponse = {
        op:'PARAGRAPH_OUTPUT',
        data:{
          output:{
            type: 'wrong type',
            data:'some data'
          }
        }
      };
      output.response(paragraphOutputResponse);
      expect(requestSpy).toHaveBeenCalledTimes(2);
      expect(requestSpy).toHaveBeenLastCalledWith(paragraphOutputRequest);
      const outputFormatsRenderNode = output.print()().inputs()()['outputFormats'] as RenderNode[];
      const stubFormats = outputFormatsRenderNode.filter(outputFormat => outputFormat.isStub());
      expect(stubFormats).toHaveLength(5);
    });

    it('Should not have pending switch', () => {
      const paragraphOutputResponse = {
        op:'PARAGRAPH_OUTPUT',
        data:{
          output:{
            type: textOutputType,
            data:'some data'
          }
        }
      };
      output.response(paragraphOutputResponse);
      const outputSwitcherRenderNode = output.print()().inputs()()['outputSwitcher'] as RenderNode;
      const outputFormatsRenderNode = output.print()().inputs()()['outputFormats'] as RenderNode[];
      const stubFormats = outputFormatsRenderNode.filter(outputFormat => outputFormat.isStub());
      const textFormat = outputFormatsRenderNode.find(outputFormat => !outputFormat.isStub());
      expect(requestSpy).toHaveBeenCalledTimes(1);
      expect(outputSwitcherRenderNode.inputs()()['switchIsPending']).toBe(false);
      expect(stubFormats).toHaveLength(4);
      expect(textFormat.componentView()).toEqual(RegisteredComponents.TEXT_OUTPUT_VIEW);
    });
  });
});
