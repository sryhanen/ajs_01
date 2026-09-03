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
import {Requestable} from '../../../../../../objects/channel/requestable';
import {CommitMessageSaveView} from './commitMessageSaveView';
import {render, screen, fireEvent} from '@testing-library/angular';
import {FakeChannel} from '../../../../../../objects/channel/fakeChannel';

describe('Commit message save view integration test', () => {
  let requestable: Requestable;
  let dropDownAnchor:HTMLElement;

  beforeEach(async () => {
    requestable = new FakeChannel();
    await render(CommitMessageSaveView, {
      inputs:{
        requestable:requestable
      }
    });
    dropDownAnchor = screen.getByRole('button');
  });

  describe('Writing commit message', () => {
    let commitMessageInput:HTMLElement;
    beforeEach(() => {
      fireEvent.click(dropDownAnchor);
      commitMessageInput = screen.getByRole('textbox');
    });

    it('Should write commit message', () => {
      const commitMessage = 'some message';
      fireEvent.input(commitMessageInput, {target:{value:commitMessage}});
      expect(commitMessageInput).toHaveValue(commitMessage);
    });

    it('Should validate commit message', () => {
      const invalidCommitMessage = '    ';
      fireEvent.input(commitMessageInput, {target:{value:invalidCommitMessage}});
      expect(screen.getByText('Name is required')).toBeDefined();
    });

    describe('Saving commit message', () => {
      const commitMessage = 'some message';
      let spy;
      let commitMessageSaveButton:HTMLElement;
      beforeEach(() => {
        commitMessageSaveButton = screen.getByLabelText('Save commit message');
        spy = vi.spyOn(requestable, 'request');
      });

      it('Should send expected request', () => {
        fireEvent.input(commitMessageInput, {target:{value:commitMessage}});
        fireEvent.click(commitMessageSaveButton);
        const expectedRequest = {
          op: 'CHECKPOINT_NOTE',
          data: {
            noteId: '',
            commitMessage: commitMessage,
          }
        };
        expect(spy).toHaveBeenCalledExactlyOnceWith(expectedRequest);
      });

      it('Should close dropdown', () => {
        fireEvent.input(commitMessageInput, {target:{value:commitMessage}});
        fireEvent.click(commitMessageSaveButton);
        expect(() => screen.getByRole('textbox')).toThrow();
      });

      it('Should not commit empty message', () => {
        fireEvent.click(commitMessageSaveButton);
        expect(spy).toHaveBeenCalledTimes(0);
        expect(screen.getByRole('textbox')).toBeDefined();
      });
    });
  });
});
