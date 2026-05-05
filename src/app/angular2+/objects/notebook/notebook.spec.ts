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
import {NotebookDTO} from '../message/noteMessage/notebookDTO';
import {FakeChannel} from '../channel/fakeChannel';
import {Channel} from '../channel/channel';
import {Notebook} from './notebook';
import {NotebookImpl} from './notebookImpl';
import {MessageDTO} from '../message/messageDTO';
import {Paragraph} from '../paragraph/paragraph';
import {PushValueImpl} from '../pushValue/pushValueImpl';
import {PushValue} from '../pushValue/pushValue';
import {ParagraphOutputDTO} from '../message/paragraphOutputMessage/paragraphOutputDTO';
import {ParagraphDTO} from '../message/paragraphMessage/paragraphDTO';

describe('Notebook', () => {
  const noteId = 'noteId';
  const paragraph1:ParagraphDTO = {
    id: 'paragraph 1',
    text: '',
    config: {},
    settings: {
      params:{}
    }
  };
  const noteData:NotebookDTO = {
    id: noteId,
    paragraphs: [
      paragraph1,
    ],
  };
  let channel: Channel;
  let notebook:Notebook;

  beforeEach(() => {
    channel = new FakeChannel();
    notebook = new NotebookImpl(channel, noteData);
  });

  describe('Birth', () => {
    it('Should have been initialized', () => {
      expect(notebook).toBeInstanceOf(NotebookImpl);
    });

    it('Should have id', () => {
      expect(notebook.id()).toEqual(noteId);
    });

    it('Should have paragraphs', () => {
      const paragraphs = new PushValueImpl<Paragraph[]>();
      notebook.paragraphs(paragraphs);
      expect(paragraphs.value()).toHaveLength(1);
    });
  });

  describe('Request', () =>{
    it('Should decorate with id', () => {
      const data = {
        op: 'PARAGRAPH_OUTPUT_REQUEST',
        data: {
          noteId:''
        }
      };
      const decoratedData = {
        op: 'PARAGRAPH_OUTPUT_REQUEST',
        data: {
          noteId: noteId
        }
      };
      const spy = vi.spyOn(channel, 'request');
      notebook.request(data);
      expect(spy).toHaveBeenCalledWith(decoratedData);
    });

    it('Should not decorate with id', () => {
      const data = {
        op: 'RANDOM_OPERATION',
        data: {}
      };
      const spy = vi.spyOn(channel, 'request');
      notebook.request(data);
      expect(spy).toHaveBeenCalledWith(data);
    });
  });

  describe('Response behavior', () => {
    let paragraphs: PushValue<Paragraph[]>;
    let paragraphSpies:unknown[];
    beforeEach(() => {
      paragraphs = new PushValueImpl<Paragraph[]>();
      notebook.paragraphs(paragraphs);
      paragraphSpies = paragraphs.value().map(paragraph => vi.spyOn(paragraph, 'response'));
      expect(paragraphSpies).toHaveLength(1);
    });

    describe('Paragraph output response', () => {
      const paragraphOutputResponse: MessageDTO<ParagraphOutputDTO>  = {
        op:'PARAGRAPH_OUTPUT',
        data: {
          noteId: noteId,
          paragraphId: ''
        }
      };
      it('Responds paragraphs when id matches', () => {
        notebook.response(paragraphOutputResponse);
        expect(paragraphSpies[0]).toHaveBeenCalledExactlyOnceWith(paragraphOutputResponse);
      });

      it('Does not respond paragraphs when id does not match', () => {
        paragraphOutputResponse.data.noteId = 'wrongID';
        notebook.response(paragraphOutputResponse);
        expect(paragraphSpies[0]).toHaveBeenCalledTimes(0);
      });
    });

    describe('Default response', () => {
      it('Responds paragraphs by default', () => {
        const response: MessageDTO<unknown> = {
          op:'DEFAULT',
          data:{}
        };
        notebook.response(response);
        expect(paragraphSpies[0]).toHaveBeenCalledExactlyOnceWith(response);
      });
    });
  });
});
