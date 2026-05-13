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
import {OutputSwitcher} from '../../../objects/output/switcher/outputSwitcher';
import {FakeChannel} from '../../../objects/channel/fakeChannel';
import {OutputSwitcherImpl} from '../../../objects/output/switcher/outputSwitcherImpl';
import {Channel} from '../../../objects/channel/channel';
import {OutputSwitcherView} from './outputSwitcherView';
import {render, screen, fireEvent} from '@testing-library/angular';
import { test } from 'vitest';
import {FakeOutputSwitcherButton} from '../../../objects/output/switcher/button/fakeOutputSwitcherButton';

describe('OutputSwitcherView', () => {
  let channel:Channel;
  let outputSwitcher: OutputSwitcher;
  beforeEach(async () => {
    channel = new FakeChannel();
    outputSwitcher = new OutputSwitcherImpl(channel);
    await render(OutputSwitcherView, {
      inputs:{
        outputSwitcher: outputSwitcher,
        outputSwitcherButtons: [new FakeOutputSwitcherButton()]
      }
    });
  });

  describe('Birth', () => {
    test('Should have nothing visible by default', () => {
      expect(() => screen.getByRole('group')).toThrow();
      expect(() => screen.getAllByRole('button')).toThrow();
      expect(() => screen.getByRole('status')).toThrow();
    });
  });

  describe('Content visibility', () => {
    let paragraphOutputResponse;
    beforeEach(() => {
      paragraphOutputResponse = {
        op:'PARAGRAPH_OUTPUT',
        data: {
          noteId: '',
          paragraphId: '',
          output: {
            isAggregated: true,
            data: {},
            type: ''
          }
        }
      };
    });

    test('Should have buttons visible', () =>{
      outputSwitcher.response(paragraphOutputResponse);
      const buttonGroup = screen.getByRole('group');
      const buttons = screen.getAllByRole('button');
      expect(buttonGroup).toBeDefined();
      expect(buttons).toHaveLength(1);
    });

    test('Should have loader visible', () =>{
      outputSwitcher.response(paragraphOutputResponse);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      const loader = screen.getByRole('status');
      expect(loader).toBeDefined();
    });

    test('Should hide loader', () =>{
      outputSwitcher.response(paragraphOutputResponse);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      outputSwitcher.response(paragraphOutputResponse);
      expect(() => screen.getByRole('status')).toThrow();
    });
  });
});
