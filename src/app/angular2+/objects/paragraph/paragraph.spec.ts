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
import {FakeChannel} from '../channel/fakeChannel';
import {Channel} from '../channel/channel';
import {ParagraphImpl} from './paragraphImpl';
import {Paragraph} from './paragraph';
import {OutputContainerImpl} from '../output/container/outputContainerImpl';
import {MessageDTO} from '../message/messageDTO';
import {ParagraphOutputDTO} from '../message/paragraphOutputMessage/paragraphOutputDTO';
import {AngularObjectCollection} from '../angularObjectCollection/angularObjectCollection';
import {ParagraphDTO} from '../message/paragraphMessage/paragraphDTO';
import {RunParagraphDTO} from '../message/runParagraphMessage/runParagraphDTO';

describe('Paragraph', () => {
  const paragraphId = 'paragraphId';
  const paragraphText = 'test';
  let paragraphData: ParagraphDTO;
  let channel: Channel;
  let paragraph: Paragraph;
  beforeEach(() => {
    paragraphData = {
      config: {},
      params: {},
      text: paragraphText,
      id:paragraphId
    };
    channel = new FakeChannel();
  });

  describe('Birth', () => {
    beforeEach(() => {
      paragraph = new ParagraphImpl(channel, paragraphData, {} as AngularObjectCollection);
    });

    it('Should initialize', () => {
      expect(paragraph).toBeInstanceOf(ParagraphImpl);
    });

    it('Should return id', () => {
      expect(paragraph.id()).toEqual(paragraphId);
    });

    it('Should return OutputContainer', () => {
      expect(paragraph.outputContainer()).toBeInstanceOf(OutputContainerImpl);
    });
  });

  describe('Request', () => {
    let spy;
    beforeEach(() => {
      spy = vi.spyOn(channel, 'request');
      paragraph = new ParagraphImpl(channel, paragraphData, {} as AngularObjectCollection);
    });

    it('Should decorate request with paragraphId', () => {
      const requestData: MessageDTO<unknown> = {
        op: '',
        data:{
          paragraphId:'',
        }
      };
      const expectedData: MessageDTO<unknown> = {
        op: '',
        data:{
          paragraphId:paragraphId,
        }
      };
      paragraph.request(requestData);
      expect(spy).toHaveBeenCalledWith(expectedData);
    });

    it('Should decorate run paragraph request', () => {
      const requestData: MessageDTO<RunParagraphDTO> = {
        op: 'RUN_PARAGRAPH',
        data: {
          id: '',
          paragraph: '',
          config: {},
          params: {}
        }
      };
      const expectedData: MessageDTO<RunParagraphDTO> = {
        op: 'RUN_PARAGRAPH',
        data: {
          id: '',
          paragraph: paragraphText,
          config: {},
          params: {}
        }
      };
      paragraph.request(requestData);
      expect(spy).toHaveBeenCalledWith(expectedData);
    });

    it('Should send requests to channel', () => {
      const data: MessageDTO<unknown> = {
        op:'',
        data:''
      };
      paragraph.request(data);
      expect(spy).toHaveBeenCalledWith(data);
    });
  });

  describe('Response', () => {
    let spy;
    beforeEach(() => {
      paragraph = new ParagraphImpl(channel, paragraphData, {} as AngularObjectCollection);
      const container = paragraph.outputContainer();
      spy = vi.spyOn(container, 'response');
      expect(spy).toHaveBeenCalledTimes(0);
    });

    describe('PARAGRAPH response', () => {
      const message: MessageDTO<ParagraphDTO>  = {
        op:'PARAGRAPH',
        data: {
          config: {},
          params: {},
          text: '',
          id:paragraphId,
        }
      };
      it('Should send response to outputContainer', () => {
        expect(spy).toHaveBeenCalledTimes(0);
        paragraph.response(message);
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('Should not send response to outputContainer', () => {
        message.data.id = 'wrong id';
        paragraph.response(message);
        expect(spy).toHaveBeenCalledTimes(0);
      });
    });

    describe('PARAGRAPH_OUTPUT response', () => {
      const message: MessageDTO<ParagraphOutputDTO>  = {
        op:'PARAGRAPH_OUTPUT',
        data: {
          noteId:'',
          paragraphId: paragraphId,
          output:{
            type: '',
            data: {}
          }
        }
      };
      it('Should send response to outputContainer', () => {
        expect(spy).toHaveBeenCalledTimes(0);
        paragraph.response(message);
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('Should not send response to outputContainer', () => {
        message.data.paragraphId = 'wrong Id';
        paragraph.response(message);
        expect(spy).toHaveBeenCalledTimes(0);
      });
    });
  });
});
