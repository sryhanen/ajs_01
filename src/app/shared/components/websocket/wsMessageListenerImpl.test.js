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
import {WsMessageListenerImpl} from './wsMessageListenerImpl';

describe('wsMessageListener service test', () => {
  let listenerService;
  let rootscope;
  let $timeout;
  const fakeData = 'foo bar';

  beforeEach(angular.mock.inject(function(_wsMessageListener_, _$rootScope_, _$timeout_){
    listenerService = _wsMessageListener_;
    rootscope = _$rootScope_;
    $timeout = _$timeout_;
  }));

  it('Should initialize', function() {
    expect(listenerService).toBeInstanceOf(WsMessageListenerImpl);
  });

  it('Expect message EDITOR_SETTINGS', async function() {
    const result = listenerService.expectMessage('EDITOR_SETTINGS');
    rootscope.$broadcast('editorSetting', fakeData);
    await expectAsync(result).toBeResolvedTo(fakeData);
  });

  it('Expect message COMPLETION_LIST', async function() {
    const result = listenerService.expectMessage('COMPLETION_LIST');
    rootscope.$broadcast('completionList', fakeData);
    await expectAsync(result).toBeResolvedTo(fakeData);
  });

  it('Should throw error when not using hard-coded variables', function() {
    expect(() => listenerService.expectMessage('NOT_HARD_CODED'))
      .toThrow(new Error('Operation not defined: NOT_HARD_CODED'));
  });

  it('Should reject after timeout', async function() {
    const result = listenerService.expectMessage('COMPLETION_LIST');
    $timeout.flush();
    await expectAsync(result).toBeRejectedWith('Message for COMPLETION_LIST rejected after timeout 1000ms.');
  });
});
