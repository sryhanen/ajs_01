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
import {Requestable} from '../../../../../objects/channel/requestable';
import {JobSchedulerView} from './jobSchedulerView';
import {fireEvent, render, screen} from '@testing-library/angular';
import {FakeChannel} from '../../../../../objects/channel/fakeChannel';

describe('JobSchedulerView functional test', () => {
  let requestable:Requestable;
  let notebookState: {title:string, config:object};
  let toggleButton:HTMLElement;

  beforeEach(async () => {
    requestable = new FakeChannel();
    notebookState = {title: 'title', config: {}};
    await render(JobSchedulerView, {
      inputs:{
        requestable:requestable,
        notebookState:notebookState,
      }
    });
    toggleButton = screen.getByRole('button');
  });

  describe('Content visibility', () => {
    it('Should have only toggle button visible', () => {
      expect(screen.getByRole('button')).toBeDefined();
      expect(() => screen.getByRole('menu')).toThrow();
    });

    it('Should toggle dialog visibility when clicking toggle button', () => {
      fireEvent.click(toggleButton);
      const openedDialog = screen.getByRole('menu');
      fireEvent.click(toggleButton);
      const closedDialog = screen.queryByRole('menu');
      expect(openedDialog).toBeDefined();
      expect(closedDialog).toBeNull();
    });
  });

  describe('Input validation', () => {
    let input:HTMLElement;
    beforeEach(() => {
      fireEvent.click(toggleButton);
      input = screen.getByRole('textbox');
    });

    it('Should accept cron values', () => {
      const monthlyValue = '@monthly';
      const weeklyValue = '@weekly';
      const dailyValue = '@daily';
      const hourlyValue = '@hourly';
      const minimalValue = '0 0 * * * ?';
      fireEvent.input(input, {target:{value:monthlyValue}});
      const errorNotVisible1 = screen.queryByRole('alert');
      fireEvent.input(input, {target:{value:weeklyValue}});
      const errorNotVisible2= screen.queryByRole('alert');
      fireEvent.input(input, {target:{value:dailyValue}});
      const errorNotVisible3 = screen.queryByRole('alert');
      fireEvent.input(input, {target:{value:hourlyValue}});
      const errorNotVisible4= screen.queryByRole('alert');
      fireEvent.input(input, {target:{value:minimalValue}});
      const errorNotVisible5 = screen.queryByRole('alert');
      expect(errorNotVisible1).toBeNull();
      expect(errorNotVisible2).toBeNull();
      expect(errorNotVisible3).toBeNull();
      expect(errorNotVisible4).toBeNull();
      expect(errorNotVisible5).toBeNull();
    });

    it('Should show error on non-cron value', () => {
      const cronValueWithTypo = 'a 0 * * * ?';
      fireEvent.input(input, {target:{value:cronValueWithTypo}});
      const alert = screen.getByRole('alert');
      expect(alert).toBeDefined();
    });

    it('Should show error if cron interval is too short', () => {
      const tooShortCronValue = '59 * * * * ?';
      fireEvent.input(input, {target:{value:tooShortCronValue}});
      const alert = screen.getByRole('alert');
      expect(alert).toBeDefined();
      expect(alert.textContent.trim()).toEqual('The intervals in this cron expression are dangerously short. Please extend intervals.');
    });

    it('Should disable set schedule button if input is invalid', () => {
      fireEvent.input(input, {target:{value:'not cron value'}});
      const setScheduleButton = screen.getByLabelText('submit-job-schedule');
      expect(setScheduleButton).toBeDisabled();
    });
  });

  describe('Default schedule buttons', () => {
    let noScheduleButton:HTMLElement;
    let hourlyScheduleButton:HTMLElement;
    let everyThreeHoursScheduleButton:HTMLElement;
    let everySixHoursScheduleButton:HTMLElement;
    let everyTwelveHoursScheduleButton:HTMLElement;
    let everyDayScheduleButton:HTMLElement;

    beforeEach(() => {
      fireEvent.click(toggleButton);
      noScheduleButton = screen.getByText('None');
      hourlyScheduleButton = screen.getByText('1h');
      everyThreeHoursScheduleButton = screen.getByText('3h');
      everySixHoursScheduleButton = screen.getByText('6h');
      everyTwelveHoursScheduleButton = screen.getByText('12h');
      everyDayScheduleButton = screen.getByText('1D');
    });

    it('Should have default schedule buttons', () => {
      expect(noScheduleButton).toBeDefined();
      expect(hourlyScheduleButton).toBeDefined();
      expect(everyThreeHoursScheduleButton).toBeDefined();
      expect(everySixHoursScheduleButton).toBeDefined();
      expect(everyTwelveHoursScheduleButton).toBeDefined();
      expect(everyDayScheduleButton).toBeDefined();
    });

    it('Should set schedule when clicking default schedule buttons', () => {
      const scheduleInput = screen.getByRole('textbox');
      fireEvent.click(hourlyScheduleButton);
      expect(scheduleInput).toHaveValue('0 0 0/1 * * ?');
      fireEvent.click(everyThreeHoursScheduleButton);
      expect(scheduleInput).toHaveValue('0 0 0/3 * * ?');
      fireEvent.click(everySixHoursScheduleButton);
      expect(scheduleInput).toHaveValue('0 0 0/6 * * ?');
      fireEvent.click(everyTwelveHoursScheduleButton);
      expect(scheduleInput).toHaveValue('0 0 0/12 * * ?');
      fireEvent.click(everyDayScheduleButton);
      expect(scheduleInput).toHaveValue('0 0 0 * * ?');
      fireEvent.click(noScheduleButton);
      expect(scheduleInput).toHaveValue('');
    });
  });
});
