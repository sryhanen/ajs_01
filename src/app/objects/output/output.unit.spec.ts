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
import {Output} from './output';
import {Channel} from '../channel/channel';
import {FakeChannel} from '../channel/fakeChannel';
import {OutputImpl} from './outputImpl';
import {RenderNode} from '../rendering/renderNode/renderNode';

describe('Output Unit Test', () => {
  const paragraphId = 'paragraphId';
  let channel:Channel;
  let output:Output;

  beforeEach(() => {
    channel = new FakeChannel();
    output = new OutputImpl(channel, paragraphId);
  });

  describe('Printing', () => {
    let outputPrinted:RenderNode;

    beforeEach(() => {
      outputPrinted = output.print()();
    });

    it('Should have paragraphId', () => {
        expect(outputPrinted.paragraphId).toEqual(paragraphId);
    });

    it('Should have componentView', () => {
      expect(outputPrinted.componentView.isStub()).toBe(false);
    });
  });

  describe('Output response validation', () => {
    const outputType = 'outputType';
    const paragraphOutputRequest = {
      op:'PARAGRAPH_OUTPUT_REQUEST',
      data:{
        type:outputType
      }
    };
    const paragraphOutputResponse = {
      op:'PARAGRAPH_OUTPUT',
      data:{
        output:{
          type:'wrong type'
        }
      }
    };

    it('Should send paragraphOutputRequest if response type does not match requested type', () => {
      output.request(paragraphOutputRequest);
      const spy = vi.spyOn(channel, 'request');
      output.response(paragraphOutputResponse);
      expect(spy).toHaveBeenCalledExactlyOnceWith(paragraphOutputRequest);
    });

    it('Should not send paragraphOutputRequest if response type is valid', () => {
      output.request(paragraphOutputRequest);
      const spy = vi.spyOn(channel, 'request');
      paragraphOutputResponse.data.output.type = outputType;
      output.response(paragraphOutputResponse);
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });
});
