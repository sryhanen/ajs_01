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
import {Channel} from '../channel/channel';
import {NotebookCollection} from './notebookCollection';
import {FakeChannel} from '../channel/fakeChannel';
import {NotebookCollectionImpl} from './notebookCollectionImpl';
import {Notebook} from '../notebook/notebook';
import {PushValue} from '../pushValue/pushValue';
import {PushValueImpl} from '../pushValue/pushValueImpl';
import {MessageDTO} from '../message/messageDTO';
import {NotesInfoDTO} from '../message/notesInfoMessage/notesInfoDTO';
import {NotebookDTO} from '../message/noteMessage/notebookDTO';
import {Paragraph} from '../paragraph/paragraph';

describe('NotebookCollection', () => {
  let channel: Channel;
  let notebookCollection: NotebookCollection;
  let pushCollection:PushValue<Notebook[]>;

  beforeEach(() => {
    channel = new FakeChannel();
    notebookCollection = new NotebookCollectionImpl(channel);
    pushCollection = new PushValueImpl();
  });

  describe('Birth', () => {
    it('Should have been initialized', () =>{
      expect(notebookCollection).toBeInstanceOf(NotebookCollectionImpl);
    });
  });

  describe('Request', ()=> {
    it('Should send request to channel', () =>{
      const spy = vi.spyOn(channel, 'request');
      const requestData = {};
      expect(spy).toHaveBeenCalledTimes(0);
      notebookCollection.request(requestData);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Response', ()=> {
    describe('Notebook collection updates', ()=> {
      const noteId1 = 'note 1';
      const noteId2 = 'note 2';
      const noteId3 = 'note 3';
      let notesInfoMessage:MessageDTO<NotesInfoDTO>;
      beforeEach(() => {
        notesInfoMessage = {
          op:'NOTES_INFO',
          data: {
            notes: [
              {id:noteId1,},
              {id:noteId2,}
            ]
          }
        };
      });

      it('Should update notebooks on response', () => {
        notebookCollection.notebooks(pushCollection);
        expect(pushCollection.value()).toHaveLength(0);
        notebookCollection.response(notesInfoMessage);
        expect(pushCollection.value()).toHaveLength(2);
        expect(pushCollection.value().find(notebook => notebook.id()===noteId1)).toBeDefined();
        expect(pushCollection.value().find(notebook => notebook.id()===noteId2)).toBeDefined();
      });

      it('Should have notebooks after response', () => {
        notebookCollection.response(notesInfoMessage);
        notebookCollection.notebooks(pushCollection);
        expect(pushCollection.value()).toHaveLength(2);
        expect(pushCollection.value().find(notebook => notebook.id()===noteId1)).toBeDefined();
        expect(pushCollection.value().find(notebook => notebook.id()===noteId2)).toBeDefined();
      });

      it('Should overwrite previous notebooks', () =>{
        notebookCollection.notebooks(pushCollection);
        notebookCollection.response(notesInfoMessage);
        notesInfoMessage.data.notes = [{id:noteId3}];
        notebookCollection.response(notesInfoMessage);
        expect(pushCollection.value()).toHaveLength(1);
        expect(pushCollection.value().find(notebook => notebook.id()===noteId3)).toBeDefined();
      });

      it('Should append notebook to collection', () => {
        notebookCollection.notebooks(pushCollection);
        notebookCollection.response(notesInfoMessage);
        expect(pushCollection.value()).toHaveLength(2);
        const noteId4 = 'note 4';
        const notebookMessage:MessageDTO<NotebookDTO> = {
          op:'NOTE',
          data: {
            id: noteId4,
            paragraphs: []
          }
        };
        notebookCollection.response(notebookMessage);
        expect(pushCollection.value()).toHaveLength(3);
        expect(pushCollection.value().find(notebook => notebook.id()===noteId4)).toBeDefined();
      });

      it('Should update notebook in collection', () => {
        notebookCollection.notebooks(pushCollection);
        notebookCollection.response(notesInfoMessage);
        expect(pushCollection.value()).toHaveLength(2);
        const oldNote2 = pushCollection.value().find(notebook => notebook.id()===noteId2);
        const oldNote2Paragraphs = new PushValueImpl<Paragraph[]>();
        oldNote2.paragraphs(oldNote2Paragraphs);
        expect(oldNote2Paragraphs.value()).toHaveLength(0);
        const notebookMessage:MessageDTO<NotebookDTO> = {
          op:'NOTE',
          data: {
            id: noteId2,
            paragraphs: [
              {
                id: 'para1',
                text: '',
                config: undefined,
                params: undefined
              }
            ]
          }
        };
        notebookCollection.response(notebookMessage);
        const newNote2 = pushCollection.value().find(notebook => notebook.id()===noteId2);
        const newNote2Paragraphs = new PushValueImpl<Paragraph[]>();
        newNote2.paragraphs(newNote2Paragraphs);
        expect(newNote2Paragraphs.value()).toHaveLength(1);
      });

      it('Should evoke response for each notebook', () =>{
        notebookCollection.notebooks(pushCollection);
        notebookCollection.response(notesInfoMessage);
        const spies = pushCollection.value().map(note => vi.spyOn(note, 'response'));
        expect(spies).toHaveLength(2);
        expect(spies[0]).toHaveBeenCalledTimes(0);
        expect(spies[1]).toHaveBeenCalledTimes(0);
        const defaultMessage:MessageDTO<object>= {
          op:'default',
          data:{}
        };
        notebookCollection.response(defaultMessage);
        expect(spies[0]).toHaveBeenCalledTimes(1);
        expect(spies[1]).toHaveBeenCalledTimes(1);
      });
    });
  });
});
