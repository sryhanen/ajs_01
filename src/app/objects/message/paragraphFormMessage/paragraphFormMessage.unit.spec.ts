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
import {ParagraphFormMessage} from './paragraphFormMessage';
import {ParagraphFormMessageImpl} from './paragraphFormMessageImpl';
import {MessageImpl} from '../messageImpl';
import {SafeJsonImpl} from '../../safeJson/safeJsonImpl';

describe('ParagraphFormMessage unit test', () => {
  const form = [
    {name:'name1', value:'value1', type:'type1'},
    {name:'name2', value:'value2', type:'type2'},
  ];
  let paragraphFormMessageData;
  let paragraphFormMessage: ParagraphFormMessage;

  beforeEach(() => {
    paragraphFormMessageData = {
      op:'PARAGRAPH_FORM',
      data:{
        form:form
      }
    };
    paragraphFormMessage = new ParagraphFormMessageImpl(new MessageImpl(new SafeJsonImpl(paragraphFormMessageData)));
  });

  describe('Birth', () => {
    it('Should be initialized', () => {
      expect(paragraphFormMessage).toBeDefined();
    });

    it('Should have operation', () => {
      expect(paragraphFormMessage.operation()).toEqual('PARAGRAPH_FORM');
    });

    it('Should have data', () => {
      expect(paragraphFormMessage.data()).toEqual(paragraphFormMessageData.data);
    });

    it('Should have form', () => {
      expect(paragraphFormMessage.form()).toEqual(form);
    });
  });

  describe('Message validation', () => {
    it('Should throw if operation is not "PARAGRAPH_FORM"', () => {
      paragraphFormMessageData.op = '';
      paragraphFormMessage = new ParagraphFormMessageImpl(new MessageImpl(new SafeJsonImpl(paragraphFormMessageData)));
      expect(() => paragraphFormMessage.operation()).toThrow();
      expect(() => paragraphFormMessage.data()).toThrow();
      expect(() => paragraphFormMessage.form()).toThrow();
    });


    describe('Should form validation', () => {
      it('Should throw if form element does not contain name', () => {
        paragraphFormMessageData.data.form = [
          {value:'value1', type:'type1'},
        ];
        paragraphFormMessage = new ParagraphFormMessageImpl(new MessageImpl(new SafeJsonImpl(paragraphFormMessageData)));
        expect(() => paragraphFormMessage.form()).toThrow();
      });

      it('Should throw if form element does not contain value', () => {
        paragraphFormMessageData.data.form = [
          {name:'name1', type:'type1'},
        ];
        paragraphFormMessage = new ParagraphFormMessageImpl(new MessageImpl(new SafeJsonImpl(paragraphFormMessageData)));
        expect(() => paragraphFormMessage.form()).toThrow();
      });

      it('Should throw if form element does not contain type', () => {
        paragraphFormMessageData.data.form = [
          {name:'name1', value:'value1'},
        ];
        paragraphFormMessage = new ParagraphFormMessageImpl(new MessageImpl(new SafeJsonImpl(paragraphFormMessageData)));
        expect(() => paragraphFormMessage.form()).toThrow();
      });
    });
  });
});
