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
import {FakeChangeDetectorRef} from '../pushValue/fakeCdr/fakeChangeDetectorRef';
import {MessageDTO} from '../message/messageDTO';
import {NotesInfoDTO} from '../message/notesInfoMessage/notesInfoDTO';

describe('NotebookCollection', () => {
  let channel: Channel;
  let notebookCollection: NotebookCollection;
  let pushCollection:PushValue<Notebook[]>;

  beforeEach(() => {
    channel = new FakeChannel();
    notebookCollection = new NotebookCollectionImpl(channel);
    pushCollection = new PushValueImpl(new FakeChangeDetectorRef());
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
    let notesInfoMessage:MessageDTO<NotesInfoDTO>;
    let defaultMessage:MessageDTO<unknown>;
    beforeEach(() => {
      notesInfoMessage = {
        op:'NOTES_INFO',
        data: {
          notes: [
            {
              id:'note 1',
            },
            {
              id:'note 2',
            }
          ]
        }
      };
      defaultMessage = {
        op:'DEFAULT',
        data: {}
      };
      notebookCollection.notebooks(pushCollection);
    });

    it('Should update notebooks', () => {
      expect(pushCollection.value()).toHaveLength(0);
      notebookCollection.response(notesInfoMessage);
      expect(pushCollection.value()).toHaveLength(2);
    });

    it('Should not update notebooks', () => {
      expect(pushCollection.value()).toHaveLength(0);
      notebookCollection.response(defaultMessage);
      expect(pushCollection.value()).toHaveLength(0);
    });

    it('Should evoke response for each notebook', () =>{
      notebookCollection.response(notesInfoMessage);
      const spies = pushCollection.value().map(note => vi.spyOn(note, 'response'));
      expect(spies).toHaveLength(2);
      expect(spies[0]).toHaveBeenCalledTimes(0);
      expect(spies[1]).toHaveBeenCalledTimes(0);

      notebookCollection.response(defaultMessage);
      expect(spies[0]).toHaveBeenCalledTimes(1);
      expect(spies[1]).toHaveBeenCalledTimes(1);
    });
  });
});
