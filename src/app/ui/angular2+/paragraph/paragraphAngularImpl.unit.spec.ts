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
import {Paragraph} from '../../../objects/paragraph/paragraph';
import {OutputContainer} from '../../../objects/output/container/outputContainer';
import {OutputContainerImpl} from '../../../objects/output/container/outputContainerImpl';
import {FakeChannel} from '../../../objects/channel/fakeChannel';
import {Channel} from '../../../objects/channel/channel';
import {AngularObjectCollectionImpl} from '../../../objects/angularObjectCollection/angularObjectCollectionImpl';
import {OutputContainerAngularImpl} from '../output/container/outputContainerAngularImpl';
import {ParagraphAngularImpl} from './paragraphAngularImpl';

describe('ParagraphAngular unit test', () => {
  let channel: Channel;
  let paragraph:Paragraph;
  let paragraphAngular:Paragraph;
  beforeEach(() => {
    channel = new FakeChannel();
    paragraph = {
      id(): string {
        return 'id';
      },
      outputContainer(): OutputContainer {
        return new OutputContainerImpl(channel, new AngularObjectCollectionImpl(channel));
      },
      print(): object {
        return {
          id: 'id',
        };
      },
      request(data: object): void {},
      response(data: object): void {}
    };
    paragraphAngular = new ParagraphAngularImpl(paragraph);
  });

  describe('Birth', () => {
    it('Should be initialized', () => {
      expect(paragraphAngular).toBeDefined();
    });

    it('Should have id', () => {
      expect(paragraphAngular.id()).toEqual('id');
    });

    it('Should print name', () => {
      expect(paragraphAngular.print()).toEqual({id:'id'});
    });

    it('Should have OutputContainerAngular implementation', () => {
      expect(paragraphAngular.outputContainer()).toBeInstanceOf(OutputContainerAngularImpl);
    });
  });

  describe('Request', () => {
    it('Should request paragraph', () => {
      const request = {op:'', data:{}};
      const requestSpy = vi.spyOn(paragraph, 'request');
      paragraphAngular.request(request);
      expect(requestSpy).toHaveBeenCalledExactlyOnceWith(request);
    });
  });

  describe('Response', () => {
    it('Should respond outputContainer', () => {
      const response = {op:'', data:{}};
      const responseSpy = vi.spyOn(paragraphAngular.outputContainer(), 'response');
      paragraphAngular.response(response);
      expect(responseSpy).toHaveBeenCalledExactlyOnceWith(response);
    });
  });
});
