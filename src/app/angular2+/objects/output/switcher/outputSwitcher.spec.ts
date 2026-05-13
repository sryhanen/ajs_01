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
import {PushValue} from '../../pushValue/pushValue';
import {PushValueImpl} from '../../pushValue/pushValueImpl';

describe('OutputSwitcher', () => {
  let channel:Channel;
  let outputSwitcher: OutputSwitcher;
  let isSwitchable: PushValue<boolean>;
  let isLoading: PushValue<boolean>;
  let activeButton: PushValue<OutputSwitcherButton>;

  beforeEach(() => {
    channel = new FakeChannel();
    outputSwitcher = new OutputSwitcherImpl(channel);
    isSwitchable = new PushValueImpl();
    isLoading = new PushValueImpl();
    activeButton = new PushValueImpl();
    outputSwitcher.isSwitchable(isSwitchable);
    outputSwitcher.isLoading(isLoading);
    outputSwitcher.activeButton(activeButton);
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

    it('Active button is stub', () => {
      expect(activeButton.value().isStub()).toBe(true);
    });
  });

  describe('Request', () => {
    it('Should request channel', () => {
      const request = {op: 'test', data:{}};
      const spy = vi.spyOn(channel, 'request');
      outputSwitcher.request(request);
      expect(spy).toHaveBeenCalledExactlyOnceWith(request);
    });
  });

  describe('Switching format', () => {

  });
});
