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
import {OutputPluginStub} from '../../../plugins/outputPluginStub';

describe('ParagraphOutputResponse', () => {
  let channel:Channel;
  let dataTablesOutputFormat: OutputFormat;
  let uPlotOutputFormat: OutputFormat;
  let outputFormats:OutputFormat[];
  let outputSwitcher:OutputSwitcher;
  let activePlugin:PushValue<OutputPlugin>;
  let outputPluginListeners:PushValue<OutputPlugin>[];
  let paragraphOutputResponse:ParagraphOutputResponseImpl;

  beforeEach(() => {
    channel = new FakeChannel();
    dataTablesOutputFormat = new DataTablesFormat(channel);
    uPlotOutputFormat = new uPlotFormat();
    outputFormats = [dataTablesOutputFormat, uPlotOutputFormat];
    outputSwitcher = new OutputSwitcherImpl(channel);
    activePlugin = new PushValueImpl();
    activePlugin.update(new OutputPluginStub());
    outputPluginListeners = [new PushValueImpl()];
    paragraphOutputResponse = new ParagraphOutputResponseImpl(channel, outputFormats, outputSwitcher, activePlugin, outputPluginListeners);
  });

  describe('Birth', () => {
    it('Should be initialized', () => {
      expect(paragraphOutputResponse).toBeInstanceOf(ParagraphOutputResponseImpl);
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

    describe('Active plugin is updated', () => {
      beforeEach(() => {
        paragraphOutputResponse.response(paragraphOutputResponseMessage);
      });

      it('Should update active plugin from stub to dataTables', () => {
        expect(activePlugin.value().isStub()).toBe(false);
        expect(activePlugin.value().outputType()).toEqual(OutputType.dataTables);
        expect(outputPluginListeners[0].value().isStub()).toBe(false);
        expect(outputPluginListeners[0].value().outputType()).toEqual(OutputType.dataTables);
      });

      it('Should update active plugin from dataTables to uPlot', () => {
        paragraphOutputResponseMessage.data.output.type = OutputType.uPlot;
        paragraphOutputResponse.response(paragraphOutputResponseMessage);
        expect(activePlugin.value().outputType()).toEqual(OutputType.uPlot);
        expect(outputPluginListeners[0].value().outputType()).toEqual(OutputType.uPlot);
      });
    });

    describe('Sequential responses to datatables', () =>{
      it('Should respond to datatables plugin', () => {
        paragraphOutputResponse.response(paragraphOutputResponseMessage);
        const activePluginSpy = vi.spyOn(activePlugin.value(), 'response');
        const listenerPluginSpy = vi.spyOn(outputPluginListeners[0].value(), 'response');
        paragraphOutputResponse.response(paragraphOutputResponseMessage);
        paragraphOutputResponse.response(paragraphOutputResponseMessage);
        expect(activePluginSpy).toHaveBeenCalledTimes(2);
        expect(listenerPluginSpy).toHaveBeenCalledTimes(2);
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
  });
});
