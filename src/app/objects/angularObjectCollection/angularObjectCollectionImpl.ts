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
import {AngularObject} from '../angularObject/angularObject';
import {computed, signal, Signal, WritableSignal} from '@angular/core';
import {Message} from '../message/message';
import {AngularObjectUpdateMessageImpl} from '../message/angularObjectUpdate/angularObjectUpdateMessageImpl';
import {AngularObjectRemoveMessageImpl} from '../message/angularObjectRemove/angularObjectRemoveMessageImpl';
import {MessageImpl} from '../message/messageImpl';
import {WebSocketPayloadImpl} from '../webSocketPayload/webSocketPayloadImpl';

export class AngularObjectCollectionImpl implements AngularObjectCollection {
  private readonly _channel: Channel;
  private readonly _angularObjects: WritableSignal<Map<string, AngularObject>>;
  private readonly _responseEvents: Map<string, (message:Message) => void>;

  constructor(channel: Channel) {
    this._channel = channel;
    this._angularObjects = signal(new Map(), {equal: () => false});
    this._responseEvents = new Map([
      ['ANGULAR_OBJECT_UPDATE', (message:Message) => this.angularObjectUpdateResponse(message)],
      ['ANGULAR_OBJECT_REMOVE', (message:Message) => this.angularObjectRemoveResponse(message)]
    ]);
  }

  updateOrAddAngularObject(angularObject: AngularObject): void {
    this._angularObjects.update(angularObjects => {
      angularObjects.set(angularObject.name(), angularObject);
      return angularObjects;
    });
  }

  removeAngularObject(angularObjectName: string): void {
    if(!this._angularObjects().has(angularObjectName)) {
      throw new Error(`No AngularObject with name "${angularObjectName}" exits in collection.`);
    }
    this._angularObjects.update(angularObjects => {
      angularObjects.delete(angularObjectName);
      return angularObjects;
    });
  }

  request(data: object): void {
    this._channel.request(data);
  }

  response(json: object): void {
    const message = new MessageImpl(new WebSocketPayloadImpl(json));
    const eventId = message.operation();
    if(this._responseEvents.has(eventId)){
      const event = this._responseEvents.get(eventId);
      event(message);
    }
  }

  angularObjects(): Signal<AngularObject[]> {
    return computed(() => Array.from(this._angularObjects().values()));
  }

  private angularObjectRemoveResponse(message:Message): void {
    const angularObjectRemoveMessage = new AngularObjectRemoveMessageImpl(message);
    angularObjectRemoveMessage.removeAngularObject(this);
  }

  private angularObjectUpdateResponse(message:Message): void {
    const angularObjectUpdateMessage = new AngularObjectUpdateMessageImpl(message);
    angularObjectUpdateMessage.addOrUpdateAngularObject(this);
  }
}
