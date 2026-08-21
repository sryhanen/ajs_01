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
import {Requestable} from '../../../../objects/channel/requestable';
import {ParagraphTitleView} from './paragraphTitleView';
import {fireEvent, render, screen} from '@testing-library/angular';
import {FakeChannel} from '../../../../objects/channel/fakeChannel';
import {FormsModule} from '@angular/forms';
import {ComponentFixture} from '@angular/core/testing';

describe('ParagraphTitleView integration test', () => {
  let requestable:Requestable;
  const title = 'title';
  const paragraphData = {
    id:'paragraphId',
    title:title,
    text:'',
    config:{},
    settings:{}
  };

  beforeEach(() => {
    requestable = new FakeChannel();
  });

  describe('Birth', () => {
    it('Should have rendered title', async () => {
      await render(ParagraphTitleView, {
        imports: [FormsModule],
        inputs:{
          requestable: requestable,
          paragraphData: paragraphData,
        }
      });
      expect(screen.getByText(title)).toBeDefined();
    });

    it('Should render default title if paragraph title is not defined', async () => {
      const paragraphDataWithoutTitle = {
        ...paragraphData,
        title:'',
      };
      await render(ParagraphTitleView, {
        imports: [FormsModule],
        inputs:{
          requestable: requestable,
          paragraphData: paragraphDataWithoutTitle,
        }
      });
      expect(screen.getByText(/Untitled/i)).toBeDefined();
    });
  });

  describe('Changing title', () => {
    const newTitle = 'new title';
    beforeEach(async () => {
      await render(ParagraphTitleView, {
        imports: [FormsModule],
        inputs:{
          requestable: requestable,
          paragraphData: paragraphData,
        }
      });
    });

    it('Should have input visible after click', () => {
      fireEvent.click(screen.getByText(title));
      expect(screen.getByRole('textbox')).toBeDefined();
    });

    it('Should have new value visible after input', () => {
      fireEvent.click(screen.getByText(title));
      const input = screen.getByRole('textbox');
      fireEvent.click(input);
      fireEvent.change(input, {target: {value: newTitle}});
      expect(input).toHaveValue(newTitle);
    });

    it('Should have new value after submit', () => {
      fireEvent.click(screen.getByText(title));
      const input = screen.getByRole('textbox');
      fireEvent.click(input);
      fireEvent.input(input, {target: {value: newTitle}});
      fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
      expect(screen.getByText(newTitle)).toBeDefined();
    });

    it('Should send expected request on submit', () => {
      fireEvent.click(screen.getByText(title));
      const input = screen.getByRole('textbox');
      fireEvent.click(input);
      fireEvent.input(input, {target: {value: newTitle}});
      const spy = vi.spyOn(requestable, 'request');
      fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
      const expectedRequest = {
        op:'COMMIT_PARAGRAPH',
        data:{
          noteId: '',
          paragraphId:paragraphData.id,
          paragraph:paragraphData.text,
          title: newTitle,
          config: paragraphData.config,
          params: paragraphData.settings
        }
      };
      expect(spy).toHaveBeenCalledExactlyOnceWith(expectedRequest);
    });

    it('Should revert changes on canceling edit', () => {
      fireEvent.click(screen.getByText(title));
      const input = screen.getByRole('textbox');
      fireEvent.click(input);
      fireEvent.input(input, {target: {value: newTitle}});
      fireEvent.click(screen.getByRole('button', { name: /revert changes/i }));
      expect(screen.getByText(title)).toBeDefined();
    });
  });
});
