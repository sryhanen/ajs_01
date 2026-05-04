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
import {SafeJsonImpl} from './safeJsonImpl';

describe('SafeJson', () => {
  describe('Birth', () =>  {
    it('Should be initialized', () => {
      expect(new SafeJsonImpl({})).toBeInstanceOf(SafeJsonImpl);
    });
  });

  describe('Json data', () => {
    type JsonDataType = {
      stringProperty: string,
      numberProperty: number,
      booleanProperty: boolean,
      objectProperty: object
    };
    const jsonDataStub: JsonDataType = {
      stringProperty: undefined,
      numberProperty: undefined,
      booleanProperty: undefined,
      objectProperty: undefined
    };
    const jsonData:JsonDataType = {
      stringProperty: 'string',
      numberProperty: 123,
      booleanProperty: false,
      objectProperty: {}
    };

    describe('Happy deserialization', () => {
      it('Should deserialize to object', () => {
        const safeJson = new SafeJsonImpl<object>(jsonData);
        expect(safeJson.deserialized(jsonDataStub)).toEqual(jsonData);
      });

      it('Should deserialize to partial type', () => {
        type PartialJsonDataType = {
          stringProperty: string,
          numberProperty: number,
        };
        const safeJson = new SafeJsonImpl<PartialJsonDataType>(jsonData);
        expect(safeJson.deserialized(jsonDataStub)).toEqual(jsonData);
      });

      it('Should deserialize to explicit type', () => {
        const safeJson = new SafeJsonImpl<JsonDataType>(jsonData);
        expect(safeJson.deserialized(jsonDataStub)).toEqual(jsonData);
      });
    });

    describe('Unhappy deserialization', () => {
      it('deserialized should throw with missing properties', () => {
        const partialJsonData:Partial<JsonDataType> = {
          stringProperty: 'string',
          numberProperty: 123,
        };
        const safeJson = new SafeJsonImpl<JsonDataType>(partialJsonData);
        expect(() => safeJson.deserialized(jsonDataStub)).toThrow();
      });
    });
  });
});
