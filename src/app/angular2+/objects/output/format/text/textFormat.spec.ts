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
import {TextFormat} from './textFormat';
import {Channel} from '../../../channel/channel';
import {FakeChannel} from '../../../channel/fakeChannel';
import {MessageDTO} from '../../../message/messageDTO';
import {ParagraphOutputDTO} from '../../../message/paragraphOutputMessage/paragraphOutputDTO';
import {OutputType} from '../../outputType';
import {ContainerRef} from "../../../containerRef/containerRef";
import {FakeContainerRef} from "../../../containerRef/fakeContainerRef";

describe('Text Format', () => {
  let textFormat: TextFormat;
  let channel: Channel;


  beforeEach(() => {
    channel = new FakeChannel();
    textFormat = new TextFormat(channel);
  });

  describe('Birth', () => {
    it('Should be initialized', () => {
      expect(textFormat).toBeInstanceOf(TextFormat);
    });

    it('Should have switcherButton stub', () => {
      const list = textFormat.switcherButtons();
      expect(list).toHaveLength(1);
      expect(list[0].isStub()).toBe(true);
    });
  });

  describe('Request', () => {
    it('Should send request channel',  () =>{
      const request = {test:'test'};
      const spy = vi.spyOn(channel, 'request');
      textFormat.request(request);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(request);
    });
  });

  describe('Paragraph output response', () => {
    let paragraphOutputResponse: MessageDTO<ParagraphOutputDTO>;
    let containerRef: ContainerRef;
    let createComponentSpy;
    let clearSpy;
    beforeEach(() => {
      containerRef = new FakeContainerRef();
      createComponentSpy = vi.spyOn(containerRef, 'createComponent');
      clearSpy = vi.spyOn(containerRef, 'clear');
      paragraphOutputResponse = {
        op:'PARAGRAPH_OUTPUT',
        data: {
          noteId:'',
          paragraphId:'',
          output: {
            data: 'Test data',
            type: OutputType.text,
          }
        }
      };
      textFormat.pushContainerRef(containerRef);
      expect(createComponentSpy).toHaveBeenCalledTimes(0);
      expect(clearSpy).toHaveBeenCalledTimes(0);
    });

    it('Should create component', () => {
      textFormat.response(paragraphOutputResponse);
      expect(clearSpy).toHaveBeenCalledTimes(1);
      expect(createComponentSpy).toHaveBeenCalledTimes(1);
    });

    it('Should create new component for sequential updates', () => {
      textFormat.response(paragraphOutputResponse);
      textFormat.response(paragraphOutputResponse);
      expect(clearSpy).toHaveBeenCalledTimes(2);
      expect(createComponentSpy).toHaveBeenCalledTimes(2);
    });

    it('Should only clear component', () => {
      paragraphOutputResponse.data.output = undefined;
      textFormat.response(paragraphOutputResponse);
      expect(createComponentSpy).toHaveBeenCalledTimes(0);
      expect(clearSpy).toHaveBeenCalledTimes(1);
    });

    it('Should only clear component', () => {
      paragraphOutputResponse.data.output.type = 'dataTable';
      textFormat.response(paragraphOutputResponse);
      expect(createComponentSpy).toHaveBeenCalledTimes(0);
      expect(clearSpy).toHaveBeenCalledTimes(1);
    });
  });
});
