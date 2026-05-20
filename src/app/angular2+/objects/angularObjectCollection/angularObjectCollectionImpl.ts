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
import {AngularObjectCollection} from './angularObjectCollection';
import {Channel} from '../channel/channel';
import {MessageDTO} from '../message/messageDTO';
import {AngularObjectUpdateMessageImpl} from '../message/angularObjectUpdateMessage/angularObjectUpdateMessageImpl';
import {AngularObjectUpdateDTO} from '../message/angularObjectUpdateMessage/angularObjectUpdateDTO';
import {PushValue} from '../pushValue/pushValue';
import {AngularObjectRemoveDTO} from '../message/angularObjectRemoveMessage/angularObjectRemoveDTO';
import {AngularObject} from '../angularObject/angularObject';

export class AngularObjectCollectionImpl implements AngularObjectCollection {
  private readonly _channel: Channel;
  private readonly _angularObjects: AngularObject<unknown>[];
  private readonly _pushValues: PushValue<AngularObject<unknown>[]>[];

  constructor(channel: Channel) {
    this._channel = channel;
    this._angularObjects = [];
    this._pushValues = [];
  }

  request(data: object): void {
    this._channel.request(data);
  }

  response(data: object): void {
    const message = data as MessageDTO<unknown>;
    if(message.op === 'ANGULAR_OBJECT_UPDATE'){
      const angularObjectUpdateMessage = new AngularObjectUpdateMessageImpl(message.data as AngularObjectUpdateDTO);
      const angularObject = angularObjectUpdateMessage.toAngularObject(this);
      const existingAngularObjectIndex = this._angularObjects.findIndex(ao => ao.name() === angularObject.name());
      if(existingAngularObjectIndex !== -1){
        this._angularObjects.splice(existingAngularObjectIndex, 1);
      }
      this._angularObjects.push(angularObject);
      this._pushValues.forEach(value => value.update(this._angularObjects));
    }
    else if(message.op === 'ANGULAR_OBJECT_REMOVE'){
      const objectToRemove = message.data as AngularObjectRemoveDTO;
      const objectIndex = this._angularObjects.findIndex(ao => ao.name() === objectToRemove.name);
      this._angularObjects.splice(objectIndex, 1);
      this._pushValues.forEach(value => value.update(this._angularObjects));
    }
  }

  angularObjects(value: PushValue<AngularObject<unknown>[]>): void {
    value.update(this._angularObjects);
    this._pushValues.push(value);
  }
}
