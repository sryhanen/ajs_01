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
describe('Directive: Drop-Zone', () => {
  beforeEach(angular.mock.module('zeppelinWebApp.comDragdrop'));
  let scope,
    element,
    compiled,
    $compile;
  const zoneMock = {
    id: 'values',
    aggr: true,
    content: [],
    limit: 0,
  };

  let resultItem, resultZone;

  const dragItemMock = function (zone, input) {

    resultZone = zone;
    resultItem = input;
  };

  const itemMock = {name: 'YEAR', data: 'test2', aggr: 'none',};
  const eventMock = {
    dataTransfer: {
      getData: function (name) {

        return itemMock;
      }
    },
    preventDefault: function (){},
  };

  beforeEach(angular.mock.inject(function($injector, $rootScope,  _$compile_, _$templateCache_, _$timeout_) {
    scope = $rootScope.$new();
    $compile = _$compile_;
    scope.$digest();
    element = angular.element(
      '<drop-zone aggregation-list="aggregationExport"'+
                 'class="d-block w-100 p-4 rounded-4 drop-column"'+
                 'zone="zone"'+
                 'add="dragitem">');
    scope.aggregationExport = [
      'SUM',
      'COUNT',
      'AVG',
      'FLOOR'
    ];
    scope.zone = zoneMock;
    scope.dragitem = dragItemMock;
    compiled = $compile(element)(scope);
    scope.$digest();

  }));

  it('should init correctly', () => {
    const drop = compiled[0].ondrop;
    const innerScope = compiled.scope();
    expect(drop).toBeDefined();
    expect(innerScope.zone).toBeDefined();
    expect(innerScope.zone.id).toEqual('values');
  });

  it('should use drop function', () => {
    const drop = compiled[0].ondrop;
    drop(eventMock);
    scope.$digest();
    expect(resultItem).toEqual(itemMock);
    expect(resultZone).toEqual(zoneMock);
  });

});
