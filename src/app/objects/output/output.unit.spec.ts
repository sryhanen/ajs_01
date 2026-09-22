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
import {CreateFakeChannel} from '../../../test/fakes/fakeChannel/fakeChannelFactory';
import {OutputImpl} from './outputImpl';
import {RenderNode} from '../rendering/renderNode/renderNode';
import {OutputPayload} from './outputPayload';
import {OutputType} from './outputType';
import {Signal} from '@angular/core';

describe('Output unit test', () => {
  let channel:Channel;
  let output:Output;

  beforeEach(() => {
    channel = CreateFakeChannel();
    output = new OutputImpl(channel);
  });

  it('Should print', () => {
    const outputPrinted = output.print()();
    const inputs = outputPrinted.inputs()();
    expect(outputPrinted.isStub()).toBe(false);
    expect(inputs['interpreterErrorListener']).toBeDefined();
    expect(inputs['outputSwitcher']).toBeDefined();
    expect((inputs['output'] as RenderNode).isStub()).toBe(true);
  });

  it('Should request channel', () => {
    const request = {
      op:'test',
      data:{}
    };
    output.request(request);
    expect(channel.request).toHaveBeenCalledExactlyOnceWith(request);
  });

  describe('Rendering', () => {
    let outputData:OutputPayload<unknown>;
    let inputs:Signal<Record<string, unknown>>;
    beforeEach(() => {
      const outputPrinted = output.print()();
      inputs = outputPrinted.inputs();
    });

    it('Should render html output', () => {
      outputData = {
        data: '',
        type: OutputType.html,
        isAggregated: false,
      };
      output.render(outputData);
      expect((inputs()['output'] as RenderNode).isStub()).toBe(false);
    });

    it('Should render text output', () => {
      outputData = {
        data: '',
        type: OutputType.text,
        isAggregated: false,
      };
      output.render(outputData);
      expect((inputs()['output'] as RenderNode).isStub()).toBe(false);
    });

    it('Should render angular output', () => {
      outputData = {
        data: '',
        type: OutputType.angular,
        isAggregated: false,
      };
      output.render(outputData);
      expect((inputs()['output'] as RenderNode).isStub()).toBe(false);
    });

    it('Should render uPlot output', () => {
      outputData = {
        data: [],
        options:{
          labels:[],
          series:[],
          xAxisLabel: '',
          graphType:''
        },
        type: OutputType.uPlot,
        isAggregated: false,
      };
      output.render(outputData);
      expect((inputs()['output'] as RenderNode).isStub()).toBe(false);
    });

    it('Should render dataTables output', () => {
      outputData = {
        data: {},
        options:{
          headers:[],
        },
        type: OutputType.dataTables,
        isAggregated: false,
      };
      output.render(outputData);
      expect((inputs()['output'] as RenderNode).isStub()).toBe(false);
    });
  });
});
