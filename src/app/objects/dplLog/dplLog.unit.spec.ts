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
import {Channel} from '../channel/channel';
import {DplLog} from './dplLog';
import {FakeChannel} from '../channel/fakeChannel';
import {DplLogImpl} from './dplLogImpl';

describe('DplLog unit test', () => {
  let channel: Channel;
  let dplLog: DplLog;

  beforeEach(() => {
    channel = new FakeChannel();
    dplLog = new DplLogImpl(channel);
  });

  describe('Birth', () => {
    it('Should be initialized', () => {
      expect(dplLog).toBeDefined();
    });

    it('Should print', () => {
      const printed= dplLog.print()();
      expect(printed.componentView.isStub()).toBe(true);
    });
  });

  describe('Responses', () => {
    const batchMsgResponse = {
      op:'ANGULAR_OBJECT_UPDATE',
      data:{
        angularObject:{
          name:'batchMsg',
          object:'value1'
        },
        interpreterGroupId:'interpreterGroupId'
      }
    };
    const timeMsgResponse = {
      op:'ANGULAR_OBJECT_UPDATE',
      data:{
        angularObject:{
          name:'timeMsg',
          object:'value2'
        },
        interpreterGroupId:'interpreterGroupId'
      }
    };
    const removeTimeMsgResponse = {
      op:'ANGULAR_OBJECT_REMOVE',
      data:{
        name:'timeMsg',
      }
    };

    it('AngularObjectUpdate response should update componentView', () => {
      dplLog.response(batchMsgResponse);
      const printed= dplLog.print()();
      const componentView = printed.componentView;
      expect(componentView.isStub()).toBe(false);
      const inputs = componentView.inputs()()['dplLog'] as Map<string, string>;
      expect(inputs).toBeDefined();
      expect(inputs.get('batchMsg')).toEqual('value1');
    });

    it('AngularObjectRemove should delete angular object', () => {
      dplLog.response(batchMsgResponse);
      dplLog.response(timeMsgResponse);
      const printed= dplLog.print()();
      const componentView = printed.componentView;
      const inputs1 = componentView.inputs()()['dplLog'] as Map<string, string>;
      expect(inputs1).toBeDefined();
      expect(inputs1.get(batchMsgResponse.data.angularObject.name)).toBeDefined();
      expect(inputs1.get(timeMsgResponse.data.angularObject.name)).toBeDefined();
      dplLog.response(removeTimeMsgResponse);
      const inputs2 = componentView.inputs()()['dplLog'] as Map<string, string>;
      expect(inputs2.get(batchMsgResponse.data.angularObject.name)).toBeDefined();
      expect(inputs2.get(timeMsgResponse.data.angularObject.name)).not.toBeDefined();
    });

    it('Deleting all angular objects should change component view to stub', () => {
      dplLog.response(timeMsgResponse);
      const printed= dplLog.print();
      expect(printed().componentView.isStub()).toBe(false);
      dplLog.response(removeTimeMsgResponse);
      expect(printed().componentView.isStub()).toBe(true);
    });
  });
});
