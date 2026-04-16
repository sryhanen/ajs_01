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
import {AngularObject} from './angularObject';
import {AngularObjectImpl} from './angularObjectImpl';
import {FakeChannel} from '../channel/fakeChannel';
import {AngularObjectUpdateDTO} from '../message/angularObjectUpdateMessage/angularObjectUpdateDTO';
import {MessageDTO} from '../message/messageDTO';
import {AngularObjectUpdatedDTO} from '../message/angularObjectUpdatedMessage/angularObjectUpdatedDTO';

describe('AngularObject', () => {
  const channel = new FakeChannel();
  const name = 'Object 1';
  const value = 'test';
  let data:AngularObjectUpdateDTO;
  let angularObject: AngularObject<string>;

  beforeEach(() => {
    data = {
      angularObject: {
        name: name,
        noteId: '',
        object: value
      },
      interpreterGroupId: '',
      noteId: ''
    };
    angularObject = new AngularObjectImpl(channel,data);
  });

  describe('Birth', () => {
    it('Should be initialized', () => {
      expect(angularObject).toBeInstanceOf(AngularObjectImpl);
    });

    it('Should have name', () => {
      expect(angularObject.name()).toEqual(name);
    });

    it('Should have value', () => {
      expect(angularObject.value()).toEqual(value);
    });

    it('Response should throw', () => {
      expect(() => angularObject.response({})).toThrow();
    });
  });

  describe('Update', () => {
    it('Should create request', () => {
      const newValue = 'New value';
      const updateRequest: MessageDTO<AngularObjectUpdatedDTO> = {
        op: 'ANGULAR_OBJECT_UPDATED',
        data: {
          noteId: '',
          name: name,
          value: newValue,
          interpreterGroupId: ''
        },
      };
      const spy = vi.spyOn(angularObject, 'request');
      expect(spy).toHaveBeenCalledTimes(0);
      angularObject.update(newValue);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(updateRequest);
    });
  });
});
