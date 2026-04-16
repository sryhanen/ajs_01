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
import {FakeChannel} from '../../../channel/fakeChannel';
import {AngularObjectCollection} from '../../../angularObjectCollection/angularObjectCollection';
import {AngularFormat} from './angularFormat';
import {AngularObjectCollectionImpl} from '../../../angularObjectCollection/angularObjectCollectionImpl';
import {MessageDTO} from '../../../message/messageDTO';
import {ParagraphOutputDTO} from '../../../message/paragraphOutputMessage/paragraphOutputDTO';
import {OutputType} from '../../outputType';
import {ContainerRef} from '../../../containerRef/containerRef';
import {FakeContainerRef} from '../../../containerRef/fakeContainerRef';

describe('AngularFormat', () => {
  const channel = new FakeChannel();
  let angularObjectCollection: AngularObjectCollection;
  let angularFormat: AngularFormat;

  beforeEach(() => {
    angularObjectCollection = new AngularObjectCollectionImpl(channel);
    angularFormat = new AngularFormat(channel, angularObjectCollection);
  });

  describe('Birth', () => {
    it('Should be initialized', () => {
      expect(angularFormat).toBeInstanceOf(AngularFormat);
    });

    it('Should have stub switcher button', () => {
      const buttons =angularFormat.switcherButtons();
      expect(buttons).toHaveLength(1);
      expect(buttons[0].isStub()).toBe(true);
    });
  });

  describe('Request', () => {
    it('Should request channel', () => {
      const request = {test: 'test'};
      const spy = vi.spyOn(channel, 'request');
      angularFormat.request(request);
      expect(spy).toHaveBeenCalledExactlyOnceWith(request);
    });
  });

  describe('Response', () => {
    let containerRef:ContainerRef;
    let paragraphOutputMessage:MessageDTO<ParagraphOutputDTO>;
    let clearSpy;
    let createComponentSpy;
    beforeEach(() => {
      containerRef = new FakeContainerRef();
      paragraphOutputMessage = {
        op: 'PARAGRAPH_OUTPUT',
        data: {
          noteId: '',
          paragraphId: '',
          output: {
            type: OutputType.angular,
            data: '<h1>Test</h1>',
          }
        },
      };
      clearSpy = vi.spyOn(containerRef, 'clear');
      createComponentSpy = vi.spyOn(containerRef, 'createComponent');
      expect(clearSpy).toHaveBeenCalledTimes(0);
      expect(createComponentSpy).toHaveBeenCalledTimes(0);
    });

    it('Should clear container and create component', () => {
      angularFormat.pushContainerRef(containerRef);
      angularFormat.response(paragraphOutputMessage);
      expect(clearSpy).toHaveBeenCalledTimes(1);
      expect(createComponentSpy).toHaveBeenCalledTimes(1);
    });

    it('Should create component if received response before containerReference', () => {
      angularFormat.response(paragraphOutputMessage);
      angularFormat.pushContainerRef(containerRef);
      expect(createComponentSpy).toHaveBeenCalledTimes(1);
      expect(clearSpy).toHaveBeenCalledTimes(0);
    });

    it('Should only clear container', () => {
      angularFormat.pushContainerRef(containerRef);
      paragraphOutputMessage.data.output = undefined;
      angularFormat.response(paragraphOutputMessage);
      expect(clearSpy).toHaveBeenCalledTimes(1);
      expect(createComponentSpy).toHaveBeenCalledTimes(0);
    });

    it('Should only clear container', () => {
      angularFormat.pushContainerRef(containerRef);
      paragraphOutputMessage.data.output.type = 'text';
      angularFormat.response(paragraphOutputMessage);
      expect(clearSpy).toHaveBeenCalledTimes(1);
      expect(createComponentSpy).toHaveBeenCalledTimes(0);
    });
  });
});
