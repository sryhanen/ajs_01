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
import {fireEvent, render, screen} from '@testing-library/angular';
import {DplLogDataView} from './dplLogDataView';
import {DplLogData} from '../../../../objects/output/dplLog/dplLogData/dplLogData';
import {signal, WritableSignal} from '@angular/core';
import {ComponentFixture} from '@angular/core/testing';
import {DplLogDataImpl} from '../../../../objects/output/dplLog/dplLogData/dplLogDataImpl';
import {DplLogDataPropertyImpl} from '../../../../objects/output/dplLog/dplLogData/dplLogDataProperty/dplLogDataPropertyImpl';
import {
  DplLogDataPropertyStub
} from '../../../../objects/output/dplLog/dplLogData/dplLogDataProperty/dplLogDataPropertyStub';

describe('DplLogDataView functional test', () => {
  let dplLogData:DplLogData;
  let dplLogDataSignal: WritableSignal<DplLogData>;
  let fixture: ComponentFixture<DplLogDataView>;
  const batchMessageText = 'batchMessage';
  const timeMessageText = 'timeMessage';
  const messageText = 'message';

  beforeEach(async () => {
    dplLogData = new DplLogDataImpl(new DplLogDataPropertyImpl(batchMessageText),new DplLogDataPropertyImpl(timeMessageText),new DplLogDataPropertyImpl(messageText));
    dplLogDataSignal = signal(dplLogData);
    const renderResult = await render(DplLogDataView);
    fixture = renderResult.fixture;
    fixture.componentRef.setInput('dplLogData', dplLogDataSignal);
    fixture.detectChanges();
  });

  describe('Birth', () => {
    it('Should be initialized', () => {
      expect(fixture.componentInstance).toBeDefined();
    });

    it('Should have button visible', () => {
      expect(screen.getByRole('button')).toBeDefined();
    });

    it('Should not have content visible', () => {
      expect(() => screen.getByText(batchMessageText)).toThrow();
      expect(() => screen.getByText(timeMessageText)).toThrow();
      expect(() => screen.getByText(messageText)).toThrow();
    });
  });

  describe('Content visibility', () => {
    beforeEach(() => {
      fireEvent.click(screen.getByRole('button'));
    });

    it('Should have content visible', () => {
      expect(screen.getByText(batchMessageText)).toBeDefined();
      expect(screen.getByText(timeMessageText)).toBeDefined();
      expect(screen.getByText(messageText)).toBeDefined();
    });

    it('Should hide content after click', () => {
      fireEvent.click(screen.getByRole('button'));
      expect(() => screen.getByText(batchMessageText)).toThrow();
      expect(() => screen.getByText(timeMessageText)).toThrow();
      expect(() => screen.getByText(messageText)).toThrow();
    });

    it('Should render only timeMessage and message', () => {
      dplLogDataSignal.set(new DplLogDataImpl(new DplLogDataPropertyStub(),new DplLogDataPropertyImpl(timeMessageText),new DplLogDataPropertyImpl(messageText)));
      fixture.detectChanges();
      expect(() => screen.getByText(batchMessageText)).toThrow();
      expect(screen.getByText(timeMessageText)).toBeDefined();
      expect(screen.getByText(messageText)).toBeDefined();
    });

    it('Should render only batchMessage and message', () => {
      dplLogDataSignal.set(new DplLogDataImpl(new DplLogDataPropertyImpl(batchMessageText), new DplLogDataPropertyStub(),new DplLogDataPropertyImpl(messageText)));
      fixture.detectChanges();
      expect(screen.getByText(batchMessageText)).toBeDefined();
      expect(() => screen.getByText(timeMessageText)).toThrow();
      expect(screen.getByText(messageText)).toBeDefined();
    });

    it('Should render only batchMessage and timeMessage', () => {
      dplLogDataSignal.set(new DplLogDataImpl(new DplLogDataPropertyImpl(batchMessageText),new DplLogDataPropertyImpl(timeMessageText),new DplLogDataPropertyStub()));
      fixture.detectChanges();
      expect(screen.getByText(batchMessageText)).toBeDefined();
      expect(screen.getByText(timeMessageText)).toBeDefined();
      expect(() => screen.getByText(messageText)).toThrow();
    });
  });
});
