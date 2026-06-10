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
import {OutputSwitcherButton} from './button/outputSwitcherButton';
import {FakeOutputSwitcherButton} from './button/fakeOutputSwitcherButton';

describe('OutputSwitcher', () => {
  let channel:Channel;
  let outputSwitcher: OutputSwitcher;
  const switcherButton: OutputSwitcherButton = new FakeOutputSwitcherButton();

  beforeEach(() => {
    channel = new FakeChannel();
    outputSwitcher = new OutputSwitcherImpl(channel);
  });

  describe('Birth', () => {
    it('Should initialize', () => {
      expect(outputSwitcher).toBeInstanceOf(OutputSwitcherImpl);
    });
  });

  describe('Format switch request', () => {
    let channelSpy;
    beforeEach(() => {
      channelSpy = vi.spyOn(channel, 'request');
      outputSwitcher.requestFormatSwitch(switcherButton);
    });

    it('Should have requested channel', () => {
      expect(channelSpy).toHaveBeenCalledOnce();
    });

    it('Should be loading', () => {
      expect(outputSwitcher.status().isLoading).toBe(true);
      expect(outputSwitcher.status().isSwitchable).toBe(false);
    });
  });

  describe('Output type validation', () => {
    it('Should be true if no request has been made', () => {
      expect(outputSwitcher.outputTypeIsValid('')).toBe(true);
    });

    it('Should be true if output type matches', () => {
      const outputType = switcherButton.requestData().data.type;
      outputSwitcher.requestFormatSwitch(switcherButton);
      expect(outputSwitcher.outputTypeIsValid(outputType)).toBe(true);
    });

    it('Should be false if output does not match', () => {
      outputSwitcher.requestFormatSwitch(switcherButton);
      expect(outputSwitcher.outputTypeIsValid('wrongType')).toBe(false);
    });
  });

  describe('Active button', () => {
    it('Has active button stub by default', () => {
      expect(outputSwitcher.activeButton().isStub()).toBe(true);
    });

    it('Updates active button after request', () => {
      outputSwitcher.requestFormatSwitch(switcherButton);
      expect(outputSwitcher.activeButton().isStub()).toBe(false);
    });
  });

  describe('Status updates', () => {
    let response:{
      op:string,
      data: {
        output:{
          isAggregated?:boolean,
        }
      }
    };
    beforeEach(() => {
      response = {
        op:'PARAGRAPH_OUTPUT',
        data:{
          output:{}
        }
      };
    });
    it('Has default status', () => {
      expect(outputSwitcher.status().isSwitchable).toBe(false);
      expect(outputSwitcher.status().isLoading).toBe(false);
    });

    it('Is switchable and not loading after response', () => {
      response.data.output.isAggregated = true;
      outputSwitcher.response(response);
      const status = outputSwitcher.status();
      expect(status.isLoading).toBe(false);
      expect(status.isSwitchable).toBe(true);
    });

    it('Is not switchable and not loading after response', () => {
      response.data.output.isAggregated = false;
      outputSwitcher.response(response);
      const status = outputSwitcher.status();
      expect(status.isLoading).toBe(false);
      expect(status.isSwitchable).toBe(false);
    });

    it('Is not switchable and not loading after response', () => {
      outputSwitcher.response(response);
      const status = outputSwitcher.status();
      expect(status.isLoading).toBe(false);
      expect(status.isSwitchable).toBe(false);
    });
  });
});
