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
import {FakeChannel} from '../../../../../objects/channel/fakeChannel';
import {fireEvent, render, screen} from '@testing-library/angular';
import {JobSchedulerView} from './jobSchedulerView';
import {ComponentFixture} from '@angular/core/testing';

describe('JobSchedulerView integration test', () => {
  let requestable:Requestable;
  let notebookState: {
    title:string,
    config:{
      cronInput?:string
    }
  };
  let fixture:ComponentFixture<JobSchedulerView>;
  const cronInput = '0 0 0/1 * * ?';

  describe('Initialization with and without cronInput', () => {
    let toggleButton:HTMLElement;
    beforeEach(async () => {
      requestable = new FakeChannel();
      notebookState = {title: 'title', config: {}};
      const renderResult = await render(JobSchedulerView, {
        inputs:{
          requestable:requestable,
          notebookState:notebookState,
          cronInput:cronInput
        }
      });
      fixture = renderResult.fixture;
      toggleButton = screen.getByRole('button');
      fireEvent.click(toggleButton);
    });

    it('Should have cron input set to input field', () => {
      expect(screen.getByRole('textbox')).toHaveValue(cronInput);
    });

    it('Should have btn-info class name', () => {
      expect(toggleButton).toHaveClass('btn-info');
      expect(toggleButton).not.toHaveClass('btn-secondary');
    });

    it('Should have btn-secondary class name if cronInput is empty string', () => {
      fixture.componentRef.setInput('cronInput', '');
      fixture.detectChanges();
      expect(toggleButton).toHaveClass('btn-secondary');
      expect(toggleButton).not.toHaveClass('btn-info');
    });
  });

  describe('Setting schedule', () => {
    beforeEach(async () => {
      requestable = new FakeChannel();
      notebookState = {title: 'title', config: {}};
      const renderResult = await render(JobSchedulerView, {
        inputs:{
          requestable:requestable,
          notebookState:notebookState,
          cronInput:cronInput
        }
      });
      fixture = renderResult.fixture;
      fireEvent.click(screen.getByRole('button'));
    });

    it('Should send expected request when setting schedule', () => {
      const spy = vi.spyOn(requestable, 'request');
      fireEvent.click(screen.getByLabelText('submit-job-schedule'));
      const expectedRequest = {
        op: 'NOTE_UPDATE',
        data: {
          noteId: '',
          name: notebookState.title,
          config: {
            cron:cronInput
          }
        }
      };
      expect(spy).toHaveBeenCalledExactlyOnceWith(expectedRequest);
    });

    it('Should not send request if input is invalid', () => {
      const invalidInput = 'a 0 * * * ?';
      fireEvent.input(screen.getByRole('textbox'), {target: {value: invalidInput}});
      const spy = vi.spyOn(requestable, 'request');
      fireEvent.click(screen.getByLabelText('submit-job-schedule'));
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });
});
