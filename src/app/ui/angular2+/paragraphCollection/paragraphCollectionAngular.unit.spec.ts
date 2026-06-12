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
import {ParagraphCollection} from '../../../objects/paragraphCollection/paragraphCollection';
import {ParagraphCollectionAngularImpl} from './paragraphCollectionAngularImpl';
import {Paragraph} from '../../../objects/paragraph/paragraph';
import {ParagraphImpl} from '../../../objects/paragraph/paragraphImpl';
import {Channel} from '../../../objects/channel/channel';
import {FakeChannel} from '../../../objects/channel/fakeChannel';

describe('ParagraphCollectionAngular unit test', () => {
  let channel:Channel;
  let paragraphCollection: ParagraphCollection;
  let paragraphMap: Map<string, Paragraph>;
  let paragraphCollectionAngular: ParagraphCollection;

  beforeEach(() => {
    channel = new FakeChannel();
    paragraphMap = new Map();
    paragraphCollection = {
      paragraphs(): Map<string, Paragraph>{
        return paragraphMap;
      },
      response(data: object) {
        paragraphMap.set(paragraphMap.size.toString(), new ParagraphImpl(channel, {id:paragraphMap.size.toString()}));
      },
      request(data: object) {},
      isStub(): boolean {
        return false;
      }
    };
    paragraphCollectionAngular = new ParagraphCollectionAngularImpl(paragraphCollection);
  });

  describe('Birth', () => {
    it('Should be initialized', () => {
      expect(paragraphCollectionAngular).toBeDefined();
    });

    it('Should not be a stub', () => {
      expect(paragraphCollectionAngular.isStub()).toBe(false);
    });

    it('Should have paragraphs', () => {
      expect(paragraphCollectionAngular.paragraphs()).toHaveLength(0);
    });
  });

  describe('Request', () => {
    it('Should request ParagraphCollection', () => {
      const request = {op:'', data:{}};
      const requestSpy = vi.spyOn(paragraphCollection, 'request');
      paragraphCollection.request(request);
      expect(requestSpy).toHaveBeenCalledExactlyOnceWith(request);
    });
  });

  describe('Response', () => {
    it('Should update ParagraphCollection on response', () => {
      const response = {
        op:'',
        data:{}
      };
      paragraphCollection.response(response);
      paragraphCollection.response(response);
      paragraphCollection.response(response);
      paragraphCollection.response(response);
      paragraphCollectionAngular.response(response);
      expect(paragraphCollectionAngular.paragraphs().size).toEqual(4);
    });
  });
});
