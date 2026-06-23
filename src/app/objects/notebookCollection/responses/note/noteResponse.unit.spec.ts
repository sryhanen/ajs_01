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
import {Notebook} from '../../../notebook/notebook';
import {Channel} from '../../../channel/channel';
import {NoteResponse} from './noteResponse';
import {FakeChannel} from '../../../channel/fakeChannel';
import {NotebookImpl} from '../../../notebook/notebookImpl';
import {signal, WritableSignal} from '@angular/core';

describe('NoteResponse', () => {
  let channel:Channel;
  let notebooks: WritableSignal<Map<string, Notebook>>;
  let noteResponse: NoteResponse;
  let initialNotebook: Notebook;
  const initialNotebookId = 'initialNotebookId';
  const initialNotebookName = 'Notebook 1';

  beforeEach(() => {
    channel = new FakeChannel();
    initialNotebook = new NotebookImpl(channel, {id:initialNotebookId, name:initialNotebookName});
    notebooks = signal(new Map([[initialNotebook.id(), initialNotebook]]));
    noteResponse = new NoteResponse(channel, notebooks);
  });

  describe('Birth', () => {
    it('Should be initialized', () => {
      expect(noteResponse).toBeInstanceOf(NoteResponse);
    });
  });

  describe('Response', () => {
    const newNotebookName = 'Notebook 2';
    it('Should add new notebook', () => {
      const response = {
        op:'NOTE',
        data:{
          id:'newNotebookId',
          name:newNotebookName,
        }
      };
      expect(notebooks()).toHaveLength(1);
      noteResponse.response(response);
      expect(notebooks()).toHaveLength(2);
    });

    it('Should replace existing notebook', () => {
      const response = {
        op:'NOTE',
        data:{
          id: initialNotebookId,
          name: newNotebookName
        }
      };
      const previousNotebook = notebooks().get(initialNotebookId);
      expect(notebooks()).toHaveLength(1);
      noteResponse.response(response);
      expect(notebooks()).toHaveLength(1);
      expect(notebooks()).not.toEqual(previousNotebook);
    });
  });
});
