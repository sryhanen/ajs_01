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
import {ComponentFixture} from '@angular/core/testing';
import {render, screen, fireEvent} from '@testing-library/angular';
import {DynamicFormsView} from './dynamicFormsView';
import {Request} from '../../../objects/channel/request';

describe('InterpreterErrorView functional test', () => {
  const textInput = {type:'text', name:'textInput', value:'Default text'};
  const checkbox = {type:'checkbox', name:'checkbox', value:true};
  const password = {type:'password', name:'password', value:'Default password'};
  const form:{type:string, name:string, value:unknown}[] = [
    textInput,
    checkbox,
    password,
  ];
  let requestJson:object;
  const submitRequest:Request = {
    request(json: object) {
      requestJson = json;
    }
  };
  let fixture: ComponentFixture<DynamicFormsView>;

  beforeEach(async () => {
    requestJson = undefined;
    const renderResult = await render(DynamicFormsView, {
      inputs: {
        form: form,
        submitFormRequest: submitRequest
      }
    });
    fixture = renderResult.fixture;
  });

  describe('Birth', () => {
    it('Should be initialized', () => {
      expect(fixture.componentInstance).toBeDefined();
    });

    it('Should have rendered form', () => {
      expect(screen.getByRole('form')).toBeDefined();
    });

    it('Should have rendered submit button', () => {
      expect(screen.getByRole('button')).toBeDefined();
    });

    it('Should have rendered form fields', () => {
      const textField = screen.getByLabelText('text');
      const checkbox = screen.getByLabelText('checkbox');
      const passwordField = screen.getByLabelText('password');
      expect(textField).toHaveValue(textInput.value);
      expect(checkbox).toBeChecked();
      expect(passwordField).toHaveValue(password.value);
    });
  });

  describe('Form submission', () => {
    it('Should send expected request data on submission', () => {
      expect(requestJson).not.toBeDefined();
      fireEvent.click(screen.getByRole('button'));
      const expectedRequestData = {
        [textInput.name]:textInput.value,
        [password.name]:password.value,
        [checkbox.name]:checkbox.value,
      };
      expect(requestJson).toEqual(expectedRequestData);
    });
  });

  describe('User input', () => {
    it('Should update input values', () => {
      const textField = screen.getByLabelText('text');
      const checkbox = screen.getByLabelText('checkbox');
      const passwordField = screen.getByLabelText('password');
      const newTextInputValue = 'new text input value';
      fireEvent.change(textField, {target: {value: newTextInputValue}});
      fireEvent.click(checkbox);
      const newPassword = 'new password';
      fireEvent.change(passwordField, {target: {value: newPassword}});
      expect(checkbox).not.toBeChecked();
      expect(textField).toHaveValue(newTextInputValue);
      expect(passwordField).toHaveValue(newPassword);
    });
  });
});
