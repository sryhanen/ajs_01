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

describe('EditableTextView integration test', () => {
  let fixture:ComponentFixture<EditableTextView>;
  const defaultText = 'some default text';
  const textClass = 'some-text-class';

  beforeEach(async () => {
    const renderResult = await render(EditableTextView, {
      inputs:{
        text: defaultText,
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
    describe('Required is true', () => {
      let textInput:HTMLElement;
      beforeEach(() => {
        fixture.componentRef.setInput('required', true);
        fixture.detectChanges();
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
  });
});
