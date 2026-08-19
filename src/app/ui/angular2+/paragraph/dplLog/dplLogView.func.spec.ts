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
import {ComponentFixture} from '@angular/core/testing';
import {DplLogView} from './dplLogView';
import {signal} from '@angular/core';

describe('DplLogView functional test', () => {
  const dplLog = signal(new Map<string, string>());
  let fixture: ComponentFixture<DplLogView>;

  beforeEach(async () => {
    const renderResult = await render(DplLogView);
    fixture = renderResult.fixture;
    fixture.componentRef.setInput('dplLog', dplLog());
  });

  describe('Birth', () => {
    it('Should have initialized', () => {
      expect(fixture.componentInstance).toBeDefined();
    });

    it('Should have button visible', () => {
      expect(screen.getByRole('button')).toBeDefined();
    });

    it('Should have content hidden', () => {
      expect(() => screen.getByText('Data Batch Status')).toThrow();
    });
  });

  describe('Content visibility when clicking button', () => {
    it('Should show content', () => {
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByText('Data Batch Status')).toBeDefined();
    });

    it('Should hide content', () => {
      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByRole('button'));
      expect(() => screen.getByText('Data Batch Status')).toThrow();
    });
  });

  describe('DplLog visibility', () => {
    beforeEach(() => {
      fireEvent.click(screen.getByRole('button'));
    });

    it('Should display batchMsg', () => {
      const batchMsgValue = 'batchMsg value';
      dplLog.update(previousDplLog => previousDplLog.set('batchMsg', batchMsgValue));
      fixture.componentRef.setInput('dplLog', dplLog());
      fixture.changeDetectorRef.detectChanges();
      expect(screen.getByText(batchMsgValue)).toBeDefined();
    });

    it('Should display timeMsg', () => {
      const timeMsgValue = 'timeMsg value';
      dplLog.update(previousDplLog => previousDplLog.set('timeMsg', timeMsgValue));
      fixture.componentRef.setInput('dplLog', dplLog());
      fixture.changeDetectorRef.detectChanges();
      expect(screen.getByText(timeMsgValue)).toBeDefined();
    });

    it('Should display message', () => {
      const messageValue = 'message';
      dplLog.update(previousDplLog => previousDplLog.set('message', messageValue));
      fixture.componentRef.setInput('dplLog', dplLog());
      fixture.changeDetectorRef.detectChanges();
      expect(screen.getByText(messageValue)).toBeDefined();
    });

    it('Should not display values that are not either timeMsg, batchMsg or message', () => {
      const value = 'test';
      dplLog.update(previousDplLog => previousDplLog.set('value', value));
      fixture.componentRef.setInput('dplLog', dplLog());
      fixture.changeDetectorRef.detectChanges();
      expect(() => screen.getByText(value)).toThrow();
    });
  });
});
