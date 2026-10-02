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
import {FakeChannel} from '../../../test/fakes/channel/fakeChannel';
import {AngularObjectCollection} from './angularObjectCollection';
import {AngularObjectCollectionImpl} from './angularObjectCollectionImpl';
import {AngularObjectImpl} from '../angularObject/angularObjectImpl';
import { AngularObjectUpdateServerResponse
} from '../../../test/fakes/webSocketServerResponses/angularObjectUpdate/angularObjectUpdateServerResponse';
import {
  AngularObjectRemoveServerResponse
} from '../../../test/fakes/webSocketServerResponses/angularObjectRemove/angularObjectRemoveServerResponse';

describe('angularObjectCollection', () => {
  let angularObjectCollection:AngularObjectCollection;
  const channel = new FakeChannel();
  const angularObjectName = 'AngularObjectName';
  const angularObjectValue = 'AngularObjectValue';
  const angularObjectData = {name:angularObjectName, object:angularObjectValue};
  const angularObject = new AngularObjectImpl(channel, angularObjectData, 'interpreterGroupId');
  const noteId = 'noteId';

  beforeEach(() => {
    angularObjectCollection = new AngularObjectCollectionImpl(channel);
  });


  it('Should request channel', () => {
    const channelSpy = vi.spyOn(channel, 'request');
    const request = {
      op:'test',
      data:{}
    };
    angularObjectCollection.request(request);
    expect(channelSpy).toHaveBeenCalledExactlyOnceWith(request);
  });

  it('Should have no angularObjects', () => {
    expect(angularObjectCollection.angularObjects()()).toEqual([]);
  });

  it('Should add angularObject', () => {
    angularObjectCollection.updateOrAddAngularObject(angularObject);
    expect(angularObjectCollection.angularObjects()()).toHaveLength(1);
    expect(angularObjectCollection.angularObjects()()[0].name()).toEqual(angularObjectName);
    expect(angularObjectCollection.angularObjects()()[0].value()).toEqual(angularObjectValue);
  });

  it('Should update angularObject', () => {
    const newValue = 'new value';
    const newAngularObject = new AngularObjectImpl(channel, {
      name:angularObjectName,
      object:newValue
    }, '');
    angularObjectCollection.updateOrAddAngularObject(angularObject);
    const angularObjectBeforeUpdate = angularObjectCollection.angularObjects()()[0];
    angularObjectCollection.updateOrAddAngularObject(newAngularObject);
    const angularObjectAfterUpdate = angularObjectCollection.angularObjects()()[0];
    expect(angularObjectCollection.angularObjects()()).toHaveLength(1);
    expect(angularObjectAfterUpdate.name()).toEqual(angularObjectBeforeUpdate.name());
    expect(angularObjectBeforeUpdate.value()).toEqual(angularObjectValue);
    expect(angularObjectAfterUpdate.value()).toEqual(newValue);
  });

  it('Should remove angularObject', () => {
    angularObjectCollection.updateOrAddAngularObject(angularObject);
    const angularObjectsBeforeRemove = angularObjectCollection.angularObjects()();
    angularObjectCollection.removeAngularObject(angularObjectName);
    const angularObjectsAfterRemove = angularObjectCollection.angularObjects()();
    expect(angularObjectsBeforeRemove).toHaveLength(1);
    expect(angularObjectsAfterRemove).toHaveLength(0);
  });

  it('Should throw if removing angularObject that does not exist', () => {
    expect(() => angularObjectCollection.removeAngularObject(angularObjectName)).toThrow();
  });

  it('ANGULAR_OBJECT_UPDATE response should add angularObject', () => {
    const paragraphId = 'paragraphId';
    const interpreterGroupId = 'interpreterGroupId';
    const angularObjectUpdateResponse = new AngularObjectUpdateServerResponse(noteId, paragraphId, interpreterGroupId, angularObjectData);
    const angularObjectsBeforeUpdate = angularObjectCollection.angularObjects()();
    angularObjectCollection.response(angularObjectUpdateResponse.toObject());
    const angularObjectsAfterUpdate = angularObjectCollection.angularObjects()();
    expect(angularObjectsBeforeUpdate).toHaveLength(0);
    expect(angularObjectsAfterUpdate).toHaveLength(1);
  });

  it('ANGULAR_OBJECT_REMOVE response should remove angularObject', () => {
    angularObjectCollection.updateOrAddAngularObject(angularObject);
    const angularObjectRemoveServerResponse = new AngularObjectRemoveServerResponse(noteId, angularObject.name());
    const angularObjectsBeforeRemove = angularObjectCollection.angularObjects()();
    angularObjectCollection.response(angularObjectRemoveServerResponse.toObject());
    const angularObjectsAfterRemove = angularObjectCollection.angularObjects()();
    expect(angularObjectsBeforeRemove).toHaveLength(1);
    expect(angularObjectsAfterRemove).toHaveLength(0);
  });
});
