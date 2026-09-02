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
import {NotebookTitleView} from './notebookTitleView';
import {fireEvent, render, screen} from '@testing-library/angular';
import {FakeChannel} from '../../../../../objects/channel/fakeChannel';

describe('NotebookTitleView functional test', () => {
  let requestable:Requestable;
  const title = 'title';

  beforeEach(async () => {
    requestable = new FakeChannel();
    await render(NotebookTitleView, {
      inputs:{
        requestable:requestable,
        title:title
      }
    });
  });

  describe('Core functionality', () => {
    it('Changing the title', () => {
      const newTitle = 'new title';
      fireEvent.click(screen.getByText(title));
      fireEvent.input(screen.getByRole('textbox'), {target:{value: newTitle}});
      fireEvent.click(screen.getByLabelText('Save changes'));
      expect(screen.getByText(newTitle)).toBeDefined();
    });

    it('Make changes and rollback changes', () => {
      const newTitle = 'new title';
      fireEvent.click(screen.getByText(title));
      fireEvent.input(screen.getByRole('textbox'), {target:{value: newTitle}});
      fireEvent.click(screen.getByLabelText('Revert changes'));
      expect(screen.getByText(title)).toBeDefined();
    });
  });

  describe('Validation', () => {
    it('Should render error text for path with trailing whitespace', () => {
      const pathWithTrailingWhiteSpace = 'test/ ';
      fireEvent.click(screen.getByText(title));
      fireEvent.input(screen.getByRole('textbox'), {target:{value: pathWithTrailingWhiteSpace}});
      expect(screen.getByRole('alert')).toBeDefined();
    });

    it('Should render error text for path only', () => {
      const pathOnly = 'test/';
      fireEvent.click(screen.getByText(title));
      fireEvent.input(screen.getByRole('textbox'), {target:{value: pathOnly}});
      expect(screen.getByRole('alert')).toBeDefined();
    });

    it('Should render error text for whitespace only', () => {
      const whiteSpaceOnly = '   ';
      fireEvent.click(screen.getByText(title));
      fireEvent.input(screen.getByRole('textbox'), {target:{value: whiteSpaceOnly}});
      expect(screen.getByRole('alert')).toBeDefined();
    });

    it('Should render error text for empty input', () => {
      const empty = '';
      fireEvent.click(screen.getByText(title));
      fireEvent.input(screen.getByRole('textbox'), {target:{value: empty}});
      expect(screen.getByRole('alert')).toBeDefined();
    });

    it('Should render error text for at symbol', () => {
      const atSymbol ='@';
      fireEvent.click(screen.getByText(title));
      fireEvent.input(screen.getByRole('textbox'), {target:{value: atSymbol}});
      expect(screen.getByRole('alert')).toBeDefined();
    });
  });
});
