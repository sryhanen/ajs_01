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
import {render, screen} from '@testing-library/angular';
import {ParagraphExecutionTimeView} from './paragraphExecutionTimeView';
import {ComponentFixture} from '@angular/core/testing';

describe('ParagraphExecutionTimeView', () => {
  let fixture: ComponentFixture<ParagraphExecutionTimeView>;
  let paragraphData = {
    dateStarted: new Date('2024-01-01T10:00:00Z'),
    dateFinished: new Date('2024-01-01T11:05:15Z'),
    user:'user',
    config: {
      tableHide:false
    }
  };

  beforeEach(async () => {
    paragraphData = {
      dateStarted: new Date('2024-01-01T10:00:00Z'),
      dateFinished: new Date('2024-01-01T11:05:15Z'),
      user:'user',
      config: {
        tableHide:false
      }
    };
    const renderResult = await render(ParagraphExecutionTimeView, {
      inputs:{
        paragraphData:paragraphData
      }
    });
    fixture = renderResult.fixture;
  });

  describe('Display execution time', () => {
    it('Should display the execution time', () => {
      expect(screen.getByText('Took 01h 05m 15s. Last updated by user at January 01 2024, 1:05:15 PM.')).toBeDefined();
    });

    it('Should display user as anonymous', () => {
      const newParagraphData = {
        ...paragraphData,
      };
      delete newParagraphData.user;
      fixture.componentRef.setInput('paragraphData', newParagraphData);
      fixture.detectChanges();
      expect(screen.getByText('Took 01h 05m 15s. Last updated by anonymous at January 01 2024, 1:05:15 PM.')).toBeDefined();
    });

    it('Should display Outdated if dateStarted after dateFinished', () => {
      const newParagraphData = {
        ...paragraphData,
      };
      newParagraphData.dateStarted = new Date('2025-01-01T11:05:15Z');
      fixture.componentRef.setInput('paragraphData', newParagraphData);
      fixture.detectChanges();
      expect(screen.getByText('Outdated.')).toBeDefined();
    });

    it('Should display Outdated if date is undefined', () => {
      const newParagraphData = {
        ...paragraphData,
      };
      delete newParagraphData.dateStarted;
      fixture.componentRef.setInput('paragraphData', newParagraphData);
      fixture.detectChanges();
      expect(screen.getByText('Outdated.')).toBeDefined();
    });

    it('Should not display if tableHide is true', () => {
      const newParagraphData = {
        ...paragraphData,
      };
      newParagraphData.config.tableHide = true;
      fixture.componentRef.setInput('paragraphData', newParagraphData);
      fixture.detectChanges();
      expect(() => screen.getByText(/Took/i)).toThrow();
      expect(() => screen.getByText('Outdated.')).toThrow();
    });
  });
});
