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
import {AngularObjectCollection} from './angularObjectCollection';
import {AngularObjectCollectionImpl} from './angularObjectCollectionImpl';
import {AngularObject} from '../angularObject/angularObject';
import {PushValue} from '../pushValue/pushValue';
import {PushValueImpl} from '../pushValue/pushValueImpl';
import {MessageDTO} from '../message/messageDTO';
import {AngularObjectUpdateDTO} from '../message/angularObjectUpdateMessage/angularObjectUpdateDTO';
import {AngularObjectRemoveDTO} from '../message/angularObjectRemoveMessage/angularObjectRemoveDTO';

describe('angularObjectCollection', () => {
  let angularObjectCollection:AngularObjectCollection;
  const channel = new FakeChannel();

  beforeEach(() => {
    angularObjectCollection = new AngularObjectCollectionImpl(channel);
  });

  describe('Birth', () => {
    it('Should be initialized', () => {
      expect(angularObjectCollection).toBeInstanceOf(AngularObjectCollectionImpl);
    });
  });

  describe('Collection', () => {
    let angularObjects: PushValue<AngularObject<unknown>[]>;
    let angularObjectUpdateMessage: MessageDTO<AngularObjectUpdateDTO>;
    const angularObject1 = {
      name: 'Object1',
      object: 'Some value',
      noteId: '',
    };
    beforeEach(() => {
      angularObjectUpdateMessage = {
        op: 'ANGULAR_OBJECT_UPDATE',
        data: {
          angularObject: angularObject1,
          noteId: '',
          interpreterGroupId: ''
        },
      };
      angularObjects = new PushValueImpl();
      angularObjectCollection.angularObjects(angularObjects);
      expect(angularObjects.value()).toEqual([]);
    });

    it('Should add object to collection', () => {
      angularObjectCollection.response(angularObjectUpdateMessage);
      expect(angularObjects.value()).toHaveLength(1);
      expect(angularObjects.value()[0].name()).toEqual(angularObject1.name);
    });

    it('Should respond object on updates', () => {
      angularObjectCollection.response(angularObjectUpdateMessage);
      expect(angularObjects.value()).toHaveLength(1);

      const spy = vi.spyOn(angularObjects.value()[0], 'response');
      angularObjectCollection.response(angularObjectUpdateMessage);
      expect(angularObjects.value()).toHaveLength(1);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(angularObjectUpdateMessage);
    });

    it('Should remove object from collection', () => {
      const removeResponse: MessageDTO<AngularObjectRemoveDTO> = {
        op:'ANGULAR_OBJECT_REMOVE',
        data: {
          noteId: '',
          paragraphId: '',
          name: angularObject1.name,
        }
      };
      angularObjectCollection.response(angularObjectUpdateMessage);
      expect(angularObjects.value()).toHaveLength(1);
      angularObjectCollection.response(removeResponse);
      expect(angularObjects.value()).toHaveLength(0);
    });
  });
});
