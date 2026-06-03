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
import {Response} from '../../../channel/response';
import {PushValue} from '../../../pushValue/pushValue';
import {DplLogData} from '../dplLogData/dplLogData';
import {MessageImpl} from '../../../message/messageImpl';
import {SafeJsonImpl} from '../../../safeJson/safeJsonImpl';
import {DplLogDataStub} from '../dplLogData/dplLogDataStub';
import {DplLogDataProperty} from '../dplLogData/dplLogDataProperty/dplLogDataProperty';
import {DplLogDataPropertyStub} from '../dplLogData/dplLogDataProperty/dplLogDataPropertyStub';
import {DplLogDataPropertyImpl} from '../dplLogData/dplLogDataProperty/dplLogDataPropertyImpl';
import {DplLogDataImpl} from '../dplLogData/dplLogDataImpl';

export class AngularObjectUpdateResponse implements Response{
  private readonly _dplLogDataPushValues:PushValue<DplLogData>[];
  private _dplLogData:DplLogData;
  private _batchMessage:DplLogDataProperty;
  private _timeMessage:DplLogDataProperty;
  private _message:DplLogDataProperty;

  constructor(dplLogDataPushValues:PushValue<DplLogData>[]) {
    this._dplLogDataPushValues = dplLogDataPushValues;
    this._dplLogData = new DplLogDataStub();
    this._batchMessage = new DplLogDataPropertyStub();
    this._timeMessage = new DplLogDataPropertyStub();
    this._message = new DplLogDataPropertyStub();
  }

  response(data: object): void {
    const message = new MessageImpl(new SafeJsonImpl(data));
    if(message.operation() === 'ANGULAR_OBJECT_UPDATE'){
      const angularObjectUpdateData = new SafeJsonImpl(message.data());
      const angularObjectData = new SafeJsonImpl(angularObjectUpdateData.getProperty<object>('angularObject', 'object'));
      const angularObjectName = angularObjectData.getProperty<string>('name', 'string');
      const angularObjectValue = angularObjectUpdateData.getProperty<object>('angularObject', 'object')['object'];
      if(angularObjectName === 'batchMsg'){
        this._batchMessage = new DplLogDataPropertyImpl(angularObjectValue);
      }
      else if(angularObjectName === 'timeMsg'){
        this._timeMessage = new DplLogDataPropertyImpl(angularObjectValue);
      }
      else if(angularObjectName === 'message'){
        this._message = new DplLogDataPropertyImpl(angularObjectValue);
      }
      else{
        return;
      }
      this._dplLogData = new DplLogDataImpl(this._batchMessage, this._timeMessage, this._message);
      this._dplLogDataPushValues.forEach(value => value.update(this._dplLogData));
    }
  }
}
