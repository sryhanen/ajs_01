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
  const partialNote:Partial<NotebookDTO> = {
    id: noteId
  };
  let channel: Channel;
  let notebook:Notebook;

  beforeEach(() => {
    channel = new FakeChannel();
    notebook = new NotebookImpl(channel, partialNote);
  });

  describe('Birth', () => {
    it('Should have been initialized', () => {
      expect(notebook).toBeInstanceOf(NotebookImpl);
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
        data: {
          noteId:''
        }
      };
      const spy = vi.spyOn(channel, 'request');
      notebook.request(data);
      expect(spy).toHaveBeenCalledWith(data);
    });
  });

  describe('Response behavior', () => {
    let paragraphs: PushValue<Paragraph[]>;
    let paragraphDtos: ParagraphDTO[];
    let noteResponse: MessageDTO<NotebookDTO>;
    beforeEach(() => {
      notebook = new NotebookImpl(channel, partialNote);
      paragraphs = new PushValueImpl<Paragraph[]>();
      paragraphDtos = [
        {
          id: 'paragraph 1',
          text: '',
          config: {},
          params: {}
        },
        {
          id: 'paragraph 2',
          text: '',
          config: {},
          params: {}
        }
      ];
      notebook.paragraphs(paragraphs);
      noteResponse = {
        op: 'NOTE',
        data: {
          id: noteId,
          paragraphs: paragraphDtos,
        }
      };
    });

    describe('Note response', () => {
      it('Updates paragraphs if data has same id with the note', () => {
        expect(paragraphs.value()).toEqual([]);
        notebook.response(noteResponse);
        expect(paragraphs.value()).toHaveLength(2);
      });

      it('Does not update paragraphs if data has different id with the note', () => {
        expect(paragraphs.value()).toEqual([]);
        noteResponse.data.id = 'something else';
        notebook.response(noteResponse);
        expect(paragraphs.value()).toEqual([]);
      });
    });

    describe('Paragraph added response', () => {
      let paragraphAddedResponse: MessageDTO<{paragraph:ParagraphDTO, index:number}>;
      beforeEach(() => {
        paragraphAddedResponse = {
          op: 'PARAGRAPH_ADDED',
          data: {
            paragraph: {id: 'paragraph 3', text: '', config: {}, params: {}},
            index: 0
          }
        };
      });

      it('Adds paragraph to empty list', () => {
        expect(paragraphs.value()).toEqual([]);
        notebook.response(paragraphAddedResponse);
        expect(paragraphs.value()).toHaveLength(1);
      });

      it('Adds paragraph to top of populated list', () => {
        notebook.response(noteResponse);
        expect(paragraphs.value()).toHaveLength(2);
        notebook.response(paragraphAddedResponse);
        expect(paragraphs.value()).toHaveLength(3);
        expect(paragraphs.value()[0].id()).toEqual('paragraph 3');
      });

      it('Adds paragraph to bottom of populated list', () => {
        notebook.response(noteResponse);
        expect(paragraphs.value()).toHaveLength(2);
        paragraphAddedResponse.data.index = 2;
        notebook.response(paragraphAddedResponse);
        expect(paragraphs.value()).toHaveLength(3);
        expect(paragraphs.value()[2].id()).toEqual('paragraph 3');
      });

      it('Adds paragraph to middle of populated list', () => {
        notebook.response(noteResponse);
        expect(paragraphs.value()).toHaveLength(2);
        paragraphAddedResponse.data.index = 1;
        notebook.response(paragraphAddedResponse);
        expect(paragraphs.value()).toHaveLength(3);
        expect(paragraphs.value()[1].id()).toEqual('paragraph 3');
      });
    });

    describe('Paragraph removed response', () => {
      let paragraphRemovedResponse: MessageDTO<{id:string}>;
      beforeEach(() => {
        paragraphRemovedResponse = {
          op: 'PARAGRAPH_REMOVED',
          data: {
            id: 'paragraph 1'
          }
        };
      });

      it('Removes paragraph the list', () => {
        notebook.response(noteResponse);
        notebook.response(paragraphRemovedResponse);
        expect(paragraphs.value()).toHaveLength(1);
        expect(paragraphs.value()[0].id()).toEqual('paragraph 2');
      });
    });

    describe('Paragraph output response', () => {
      let paragraphOutputResponse: MessageDTO<ParagraphOutputDTO>;
      let paragraphSpies:unknown[];
      beforeEach(() => {
        paragraphOutputResponse = {
          op:'PARAGRAPH_OUTPUT',
          data: {
            noteId: noteId,
            paragraphId: ''
          }
        };
        notebook.response(noteResponse);
        paragraphSpies = paragraphs.value().map(paragraph => vi.spyOn(paragraph, 'response'));
        expect(paragraphSpies).toHaveLength(2);
      });

      it('Responds paragraphs when id matches', () => {
        notebook.response(paragraphOutputResponse);
        expect(paragraphSpies[0]).toHaveBeenCalledTimes(1);
        expect(paragraphSpies[1]).toHaveBeenCalledTimes(1);
        expect(paragraphSpies[0]).toHaveBeenCalledWith(paragraphOutputResponse);
        expect(paragraphSpies[1]).toHaveBeenCalledWith(paragraphOutputResponse);
      });

      it('Does not respond paragraphs when id does not match', () => {
        paragraphOutputResponse.data.noteId = 'wrongID';
        notebook.response(paragraphOutputResponse);
        expect(paragraphSpies[0]).toHaveBeenCalledTimes(0);
        expect(paragraphSpies[1]).toHaveBeenCalledTimes(0);
      });
    });

    describe('Default response', () => {
      let paragraphSpies:unknown[];
      let response: MessageDTO<unknown>;
      beforeEach(() => {
        notebook.response(noteResponse);
        response = {
          op:'DEFAULT',
          data:{}
        };
        paragraphSpies = paragraphs.value().map(paragraph => vi.spyOn(paragraph, 'response'));
        expect(paragraphSpies).toHaveLength(2);
      });

      it('Responds paragraphs by default', () => {
        notebook.response(response);
        expect(paragraphSpies[0]).toHaveBeenCalledTimes(1);
        expect(paragraphSpies[1]).toHaveBeenCalledTimes(1);
        expect(paragraphSpies[0]).toHaveBeenCalledWith(response);
        expect(paragraphSpies[1]).toHaveBeenCalledWith(response);
      });
    });
  });
});
