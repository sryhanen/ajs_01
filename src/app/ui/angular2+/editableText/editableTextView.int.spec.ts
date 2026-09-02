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
import {EditableTextView} from './editableTextView';
import {ComponentFixture} from '@angular/core/testing';
import {AbstractControl, FormControl, ValidatorFn, Validators} from '@angular/forms';

describe('EditableTextView integration test', () => {
  let fixture:ComponentFixture<EditableTextView>;
  const defaultText = 'some default text';
  const textClass = 'some-text-class';
  const customValidationErrorText = 'custom validation error text';
  const customValidationErrorEvoke = 'EVOKE_CUSTOM_ERROR';
  const customValidator:ValidatorFn = (control: AbstractControl) => {
    return control.value === customValidationErrorEvoke ? {customError: customValidationErrorText} : null;
  };

  beforeEach(async () => {
    const renderResult = await render(EditableTextView, {
      inputs:{
        textValueControl: new FormControl(defaultText),
        textClassName: textClass
      }
    });
    fixture = renderResult.fixture;
  });

  describe('Class name input', () => {
    it('Text should have given class name', () =>{
      const text = screen.getByText(defaultText);
      expect(text).toHaveClass(textClass);
    });
  });

  describe('Validation', () => {
    describe('Basic validation flow', () => {
      let textInput:HTMLElement;
      beforeEach(() => {
        fixture.componentRef.setInput('textValueControl', new FormControl(defaultText, [Validators.required]));
        fireEvent.click(screen.getByText(defaultText));
        textInput = screen.getByRole('textbox');
        fireEvent.input(textInput, {target:{value:''}});
      });

      it('Should display validation text', () => {
        expect(screen.getByText('Value is required.')).toBeDefined();
      });

      it('Should disable commit button if form is invalid', () => {
        expect(screen.getByLabelText('Save changes')).toBeDisabled();
      });

      it('Should enable commit button if form is valid', () => {
        const newValue = 'new text';
        fireEvent.input(textInput, {target:{value:newValue}});
        expect(screen.getByLabelText('Save changes')).toBeEnabled();
      });
    });

    describe('Validation texts', () => {
      beforeEach(() => {
        fireEvent.click(screen.getByText(defaultText));
      });

      it('Should evoke custom error', () => {
        fixture.componentRef.setInput('textValueControl', new FormControl(defaultText, [customValidator]));
        fixture.detectChanges();
        const textInput = screen.getByRole('textbox');
        fireEvent.input(textInput, {target:{value:customValidationErrorEvoke}});
        expect(screen.getByText(customValidationErrorText));
      });

      it('Should evoke pattern error', () => {
        fixture.componentRef.setInput('textValueControl', new FormControl(defaultText, [Validators.pattern(/.*\S.*/)]));
        fixture.detectChanges();
        const textInput = screen.getByRole('textbox');
        fireEvent.input(textInput, {target:{value:'   '}});
        expect(screen.getByText('Value is invalid.')).toBeDefined();
      });

      it('Should evoke maxLength error', () => {
        fixture.componentRef.setInput('textValueControl', new FormControl(defaultText, [Validators.maxLength(3)]));
        fixture.detectChanges();
        const textInput = screen.getByRole('textbox');
        fireEvent.input(textInput, {target:{value:'aaaa'}});
        expect(screen.getByText('Must be at most 3 characters.')).toBeDefined();
      });

      it('Should evoke minLength error', () => {
        fixture.componentRef.setInput('textValueControl', new FormControl(defaultText, [Validators.minLength(2)]));
        fixture.detectChanges();
        const textInput = screen.getByRole('textbox');
        fireEvent.input(textInput, {target:{value:'a'}});
        expect(screen.getByText('Must be at least 2 characters.')).toBeDefined();
      });
    });
  });

  describe('Component output', () => {
    it('Should emit output on commit', () => {
      const newValue = 'new text value';
      fireEvent.click(screen.getByText(defaultText));
      fireEvent.input(screen.getByRole('textbox'), {target:{value:newValue}});
      let receivedOutput = '';
      const receivedOutputCallback = (value) => {
        receivedOutput = value;
      };
      fixture.componentInstance.newText.subscribe((newText) => {
        receivedOutputCallback(newText);
      });
      fireEvent.click(screen.getByLabelText('Save changes'));
      expect(receivedOutput).toEqual(newValue);
    });
  });

  describe('Placeholder text', () => {
    it('Should display placeholder text', () => {
      const placeholderText = 'some placeholder text';
      fixture.componentRef.setInput('textValueControl', new FormControl(''));
      fixture.componentRef.setInput('placeholderText', placeholderText);
      fixture.detectChanges();
      expect(screen.getByText(placeholderText)).toBeDefined();
    });

    it('Should not display placeholder text', () => {
      const placeholderText = 'some placeholder text';
      fixture.componentRef.setInput('textValueControl', new FormControl(defaultText));
      fixture.componentRef.setInput('placeholderText', placeholderText);
      fixture.detectChanges();
      expect(screen.getByText(defaultText)).toBeDefined();
    });
  });
});
