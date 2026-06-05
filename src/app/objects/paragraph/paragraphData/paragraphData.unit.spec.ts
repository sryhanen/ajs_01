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
import {ParagraphData} from './paragraphData';
import {ParagraphDataImpl} from './paragraphDataImpl';

describe('ParagraphData unit test', () => {
  let paragraphData: ParagraphData;
  let paragraphDataInput: {
    id: string;
    config:object;
    settings:object;
    text:string;
    title?:string;
    status:string;
    output?:{type?:string, data?:object};
  };
  const id = 'test-id';
  const config = {};
  const settings = {};
  const text = 'text';
  const title = 'title';
  const status = 'status';

  beforeEach(() => {
    paragraphDataInput = {
      id:id,
      config:config,
      settings:settings,
      text:text,
      title:title,
      status:status,
      output:{
        type:'type',
        data:{}
      }
    };
    paragraphData = new ParagraphDataImpl(paragraphDataInput);
  });

  describe('Birth', () => {
    it('Should be initialized', () => {
      expect(paragraphData).toBeDefined();
    });

    it('Should have id', () => {
      expect(paragraphData.id()).toEqual(id);
    });

    it('Should have config', () => {
      expect(paragraphData.config()).toEqual(config);
    });

    it('Should have settings', () => {
      expect(paragraphData.settings()).toEqual(settings);
    });

    it('Should have text', () => {
      expect(paragraphData.text()).toEqual(text);
    });

    it('Should have title', () => {
      expect(paragraphData.title()).toEqual(title);
    });

    it('Should have status', () => {
      expect(paragraphData.status()).toBeDefined();
    });

    it('Should have output', () => {
      expect(paragraphData.output().isStub()).toBe(false);
    });
  });

  describe('Validation', () => {
    it('Missing id should throw', () => {
      delete paragraphDataInput.id;
      paragraphData = new ParagraphDataImpl(paragraphDataInput);
      expect(() => paragraphData.id()).toThrow();
    });

    it('Missing config should throw', () => {
      delete paragraphDataInput.config;
      paragraphData = new ParagraphDataImpl(paragraphDataInput);
      expect(() => paragraphData.config()).toThrow();
    });

    it('Missing settings should throw', () => {
      delete paragraphDataInput.settings;
      paragraphData = new ParagraphDataImpl(paragraphDataInput);
      expect(() => paragraphData.settings()).toThrow();
    });

    it('Missing text should throw', () => {
      delete paragraphDataInput.text;
      paragraphData = new ParagraphDataImpl(paragraphDataInput);
      expect(() => paragraphData.text()).toThrow();
    });

    it('Missing title should return empty string', () => {
      delete paragraphDataInput.title;
      paragraphData = new ParagraphDataImpl(paragraphDataInput);
      expect(paragraphData.title()).toEqual('');
    });

    it('Should have status', () => {
      paragraphData = new ParagraphDataImpl(paragraphDataInput);
      expect(paragraphData.status()).toBeDefined();
    });

    it('Invalid output should return stub output', () => {
      paragraphDataInput.output = {};
      paragraphData = new ParagraphDataImpl(paragraphDataInput);
      expect(paragraphData.output().isStub()).toBe(true);
    });

    it('Missing output should return stub output', () => {
      delete paragraphDataInput.output;
      paragraphData = new ParagraphDataImpl(paragraphDataInput);
      expect(paragraphData.output().isStub()).toBe(true);
    });
  });
});
