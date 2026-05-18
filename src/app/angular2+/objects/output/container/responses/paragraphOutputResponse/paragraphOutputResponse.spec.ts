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
import {OutputFormat} from '../../../format/outputFormat';
import {OutputSwitcher} from '../../../switcher/outputSwitcher';
import {Channel} from '../../../../channel/channel';
import {ParagraphOutputResponseImpl} from './paragraphOutputResponseImpl';
import {FakeChannel} from '../../../../channel/fakeChannel';
import {OutputSwitcherImpl} from '../../../switcher/outputSwitcherImpl';
import {DataTablesFormat} from '../../../format/dataTables/dataTablesFormat';
import {uPlotFormat} from '../../../format/uPlot/uPlotFormat';
import {OutputType} from '../../../outputType';
import {PushValueImpl} from '../../../../pushValue/pushValueImpl';
import {OutputPlugin} from '../../../plugins/outputPlugin';
import {PushValue} from '../../../../pushValue/pushValue';

describe('ParagraphOutputResponse', () => {
  let channel:Channel;
  let dataTablesOutputFormat: OutputFormat;
  let uPlotOutputFormat: OutputFormat;
  let outputFormats:OutputFormat[];
  let outputSwitcher:OutputSwitcher;
  let paragraphOutputResponse:ParagraphOutputResponseImpl;
  let outputPlugin: PushValue<OutputPlugin>;

  beforeEach(() => {
    channel = new FakeChannel();
    dataTablesOutputFormat = new DataTablesFormat(channel);
    uPlotOutputFormat = new uPlotFormat();
    outputFormats = [dataTablesOutputFormat, uPlotOutputFormat];
    outputSwitcher = new OutputSwitcherImpl(channel);
    paragraphOutputResponse = new ParagraphOutputResponseImpl(channel, outputFormats, outputSwitcher);
    outputPlugin = new PushValueImpl<OutputPlugin>();
  });

  describe('Birth', () => {
    it('Should be initialized', () => {
      expect(paragraphOutputResponse).toBeInstanceOf(ParagraphOutputResponseImpl);
    });

    it('Should have plugin stub', () => {
      paragraphOutputResponse.outputPlugin(outputPlugin);
      expect(outputPlugin.value().isStub()).toBe(true);
    });
  });

  describe('Response', () => {
    let paragraphOutputResponseMessage;
    let outputData: {
      type: string,
      data: object,
      options: object,
    };
    beforeEach(()  => {
      outputData = {
        type: OutputType.dataTables,
        data: {},
        options: {},
      };
      paragraphOutputResponseMessage = {
        op:'PARAGRAPH_OUTPUT',
        data:{
          noteId:'',
          paragraphId:'',
          output:outputData
        }
      };
    });

    describe('Plugin is updated successfully on response', () => {
      it('Should update plugin', () => {
        paragraphOutputResponse.outputPlugin(outputPlugin);
        paragraphOutputResponse.response(paragraphOutputResponseMessage);
        expect(outputPlugin.value().isStub()).toBe(false);
      });

      it('Should have plugin', () => {
        paragraphOutputResponse.response(paragraphOutputResponseMessage);
        paragraphOutputResponse.outputPlugin(outputPlugin);
        expect(outputPlugin.value().isStub()).toBe(false);
      });
    });

    describe('Creates output request if received response is not in requested format', () =>{
      it('Creates request and does not update plugin', () => {
        outputSwitcher.requestFormatSwitch(uPlotOutputFormat.switcherButtons()[0]);
        const channelSpy = vi.spyOn(channel, 'request');
        const outputFormatSpies = outputFormats.map(format => vi.spyOn(format, 'plugin'));
        paragraphOutputResponse.response(paragraphOutputResponseMessage);
        expect(channelSpy).toHaveBeenCalledOnce();
        expect(outputFormatSpies[0]).toHaveBeenCalledTimes(0);
        expect(outputFormatSpies[1]).toHaveBeenCalledTimes(0);
      });
    });

    describe('Sequential responses to datatables', () =>{
      it('Should respond to datatables plugin', () => {
        paragraphOutputResponse.response(paragraphOutputResponseMessage);
        paragraphOutputResponse.outputPlugin(outputPlugin);
        const pluginSpy = vi.spyOn(outputPlugin.value(), 'response');
        paragraphOutputResponse.response(paragraphOutputResponseMessage);
        paragraphOutputResponse.response(paragraphOutputResponseMessage);
        expect(pluginSpy).toHaveBeenCalledTimes(2);
      });
    });
  });
});
