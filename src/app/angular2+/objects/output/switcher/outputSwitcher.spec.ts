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
import {Channel} from '../../channel/channel';
import {OutputSwitcher} from './outputSwitcher';
import {FakeChannel} from '../../channel/fakeChannel';
import {OutputSwitcherImpl} from './outputSwitcherImpl';
import {MessageDTO} from '../../message/messageDTO';
import {ParagraphOutputDTO} from '../../message/paragraphOutputMessage/paragraphOutputDTO';
import {ParagraphOutputRequestDTO} from '../paragraphOutputRequest/paragraphOutputRequestDTO';
import {OutputSwitcherButton} from './button/outputSwitcherButton';
import {FakeOutputSwitcherButton} from './button/fakeOutputSwitcherButton';
import {PushValue} from '../../pushValue/pushValue';
import {PushValueImpl} from '../../pushValue/pushValueImpl';
import {FakeChangeDetectorRef} from '../../pushValue/fakeCdr/fakeChangeDetectorRef';

describe('OutputSwitcher', () => {
  let channel:Channel;
  let outputSwitcher: OutputSwitcher;
  let outputFormats: Channel[];
  const cdr = new FakeChangeDetectorRef();
  let isSwitchable: PushValue<boolean>;
  let isLoading: PushValue<boolean>;
  beforeEach(() => {
    channel = new FakeChannel();
    outputFormats = [
      new FakeChannel(),
      new FakeChannel(),
    ];
    outputSwitcher = new OutputSwitcherImpl(channel, outputFormats);
    isSwitchable = new PushValueImpl(cdr);
    isLoading = new PushValueImpl(cdr);
    outputSwitcher.pushIsSwitchable(isSwitchable);
    outputSwitcher.pushIsLoading(isLoading);
  });

  describe('Birth', () => {
    it('Should initialize', () => {
      expect(outputSwitcher).toBeInstanceOf(OutputSwitcherImpl);
    });

    it('Is not switchable', () => {
      expect(isSwitchable.value()).toEqual(false);
    });

    it('Is not loading', () => {
      expect(isLoading.value()).toEqual(false);
    });
  });

  describe('Stateful properties', () => {
    let paragraphOutputResponse: MessageDTO<ParagraphOutputDTO>;
    let paragraphOutputRequest: MessageDTO<ParagraphOutputRequestDTO>;
    beforeEach(() => {
      paragraphOutputResponse = {
        op:'PARAGRAPH_OUTPUT',
        data: {
          noteId: '',
          paragraphId: '',
          output: {
            type: '',
            data: {},
            isAggregated: true,
          }
        }
      };
      paragraphOutputRequest = {
        op: 'PARAGRAPH_OUTPUT_REQUEST',
        data: {
          paragraphId: '',
          noteId: '',
          type: '',
          requestOptions: {}
        }
      };
    });

    describe('isSwitchable', () => {
      it('Should be switchable', () => {
        outputSwitcher.response(paragraphOutputResponse);
        expect(isSwitchable.value()).toBe(true);
      });

      it('Should not be switchable', () => {
        paragraphOutputResponse.data.output.isAggregated = false;
        outputSwitcher.response(paragraphOutputResponse);
        expect(isSwitchable.value()).toBe(false);
      });

      it('Should not be switchable', () => {
        paragraphOutputResponse.data.output.isAggregated = undefined;
        outputSwitcher.response(paragraphOutputResponse);
        expect(isSwitchable.value()).toBe(false);
      });
    });

    describe('isLoading', () => {
      it('Should be loading on paragraph output request', () => {
        outputSwitcher.request(paragraphOutputRequest);
        expect(isLoading.value()).toBe(true);
      });

      it('Should not be loading by default', () => {
        outputSwitcher.request({test:'test'});
        expect(isLoading.value()).toBe(false);
      });

      it('Should not be loading after receiving paragraph output', () => {
        outputSwitcher.request(paragraphOutputRequest);
        expect(isLoading.value()).toBe(true);
        outputSwitcher.response(paragraphOutputResponse);
        expect(isLoading.value()).toBe(false);
      });
    });
  });

  describe('Responses are channeled', () => {
    let paragraphOutputResponse: MessageDTO<ParagraphOutputDTO>;
    let outputFormatSpies;
    beforeEach(() => {
      paragraphOutputResponse = {
        op:'PARAGRAPH_OUTPUT',
        data: {
          noteId: '',
          paragraphId: ''
        }
      };
      outputFormatSpies = outputFormats.map(format => vi.spyOn(format, 'response'));
      expect(outputFormatSpies).toHaveLength(2);
      expect(outputFormatSpies[0]).toHaveBeenCalledTimes(0);
      expect(outputFormatSpies[1]).toHaveBeenCalledTimes(0);
    });

    it('Paragraph output response without output is channeled to output formats', () => {
      outputSwitcher.response(paragraphOutputResponse);
      expect(outputFormatSpies[0]).toHaveBeenCalledTimes(1);
      expect(outputFormatSpies[1]).toHaveBeenCalledTimes(1);
      expect(outputFormatSpies[0]).toHaveBeenCalledWith(paragraphOutputResponse);
      expect(outputFormatSpies[1]).toHaveBeenCalledWith(paragraphOutputResponse);
    });

    it('Paragraph output response with output is channeled by default to output formats', () => {
      paragraphOutputResponse.data.output = {
        data: {},
        type: ''
      };
      outputSwitcher.response(paragraphOutputResponse);
      expect(outputFormatSpies[0]).toHaveBeenCalledTimes(1);
      expect(outputFormatSpies[1]).toHaveBeenCalledTimes(1);
      expect(outputFormatSpies[0]).toHaveBeenCalledWith(paragraphOutputResponse);
      expect(outputFormatSpies[1]).toHaveBeenCalledWith(paragraphOutputResponse);
    });

    describe('After switching format', () => {
      const responseType = 'responseType';
      let switcherButton: OutputSwitcherButton;
      let channelSpy;
      beforeEach(() => {
        switcherButton = new FakeOutputSwitcherButton();
        paragraphOutputResponse.data.output = {
          type: responseType,
          data: {},
        };
        channelSpy = vi.spyOn(channel, 'request');
        expect(channelSpy).toHaveBeenCalledTimes(0);
      });

      it('Sends new request and does not channel response when type does not match', () => {
        outputSwitcher.switchFormat(switcherButton);
        expect(channelSpy).toHaveBeenCalledTimes(1);
        outputSwitcher.response(paragraphOutputResponse);
        expect(outputFormatSpies[0]).toHaveBeenCalledTimes(0);
        expect(outputFormatSpies[1]).toHaveBeenCalledTimes(0);
        expect(channelSpy).toHaveBeenCalledTimes(2);
        expect(channelSpy).toHaveBeenCalledWith(switcherButton.requestData());
      });

      it('Channels response when type matches and does not send new request', () => {
        paragraphOutputResponse.data.output.type = switcherButton.outputType();
        outputSwitcher.switchFormat(switcherButton);
        expect(channelSpy).toHaveBeenCalledTimes(1);
        outputSwitcher.response(paragraphOutputResponse);
        expect(channelSpy).toHaveBeenCalledTimes(1);
        expect(outputFormatSpies[0]).toHaveBeenCalledTimes(1);
        expect(outputFormatSpies[1]).toHaveBeenCalledTimes(1);
        expect(outputFormatSpies[0]).toHaveBeenCalledWith(paragraphOutputResponse);
        expect(outputFormatSpies[1]).toHaveBeenCalledWith(paragraphOutputResponse);
      });
    });
  });

  describe('Default request', () => {
    it('Should send generic request to channel', () => {
      const request = {test: 'test'};
      const spy = vi.spyOn(channel, 'request');
      expect(spy).toHaveBeenCalledTimes(0);
      outputSwitcher.request(request);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(request);
    });
  });
});
