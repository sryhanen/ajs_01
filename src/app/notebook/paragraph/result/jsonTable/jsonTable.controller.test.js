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
import JsonTable from '../../../../shared/objects/display/json-datatable/jsonTable';
import PaginationRequest from '../../../../shared/objects/communication/paginationRequest';

describe('JSONTable Controller Tests', () => {
  beforeEach(angular.mock.module('zeppelinWebApp.vizJsonTable'));

  let storage = {};
  const vizRegisterServiceFake = {
    linkUpdateViz: function(id, index, refresh) {
      storage = {
        id: id,
        index: index,
        refresh: refresh,
      };
    }
  };
  const websocketMsgSrvFake = {};
  const ToasterServiceFake = {
    addToast: function(message, type) {}
  };
  const id = 1;
  const index = 1;
  const tableData = {
    headers:['col1', 'col2', 'col3'],
    data: [
      {'col1': 'x1', 'col2': 'y1', 'col3': 'z1'},
      {'col1': 'x2', 'col2': 'y2', 'col3': 'z2'},
      {'col1': 'x3', 'col2': 'y3', 'col3': 'z3'},
      {'col1': 'x4', 'col2': 'y4', 'col3': 'z4'},
    ],
    draw: 1,
    recordsTotal: 4,
    recordsFiltered: 4,
  };
  const expectedColumns = [
    {title: 'col1', data: 'col1'},
    {title: 'col2', data: 'col2'},
    {title: 'col3', data: 'col3'},
  ];
  const expectedTableData = {
    data: [
      {'col1': 'x1', 'col2': 'y1', 'col3': 'z1'},
      {'col1': 'x2', 'col2': 'y2', 'col3': 'z2'},
      {'col1': 'x3', 'col2': 'y3', 'col3': 'z3'},
      {'col1': 'x4', 'col2': 'y4', 'col3': 'z4'},
    ],
    draw: 1,
    recordsTotal: 4,
    recordsFiltered: 4,
  };
  const containerID= `${id}_${index}`;
  const jsonTableID= `${containerID}_JsonTable`;

  let $controller, $rootScope, $timeout;
  let $scope, controller;
  beforeEach(angular.mock.inject(function(_$controller_, _$rootScope_, _$timeout_, ){
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    $scope = $rootScope.$new();
    $scope.noteId = 'noteId';
    $scope.paragraphId = 'paragraphId';
    controller = $controller('JsonTableCtrl', {
      $scope: $scope,
      $timeout: $timeout,
      vizRegisterService: vizRegisterServiceFake,
      websocketMsgSrv: websocketMsgSrvFake,
      ToasterService: ToasterServiceFake,
    });
    $scope.initResult(id, index, tableData);
    $scope.initViz();
  }));

  describe('Test result management flow', function() {
    it('Should initialize with expected values', function() {
      expect($scope.containerID).toEqual(containerID);
      expect($scope.jsonTableID).toEqual(jsonTableID);
      expect($scope.tableColumns.displayed()).toEqual(expectedColumns);
      expect($scope.tableData).toEqual(expectedTableData);
      expect($scope.loaded).toBeTrue();
      expect($scope.jsonTable).toBeInstanceOf(JsonTable);
      expect($scope.paginationRequest).toBeInstanceOf(PaginationRequest);
    });

    it('Should update the result', function (){
      const newData = {
        headers:['col1', 'col2', 'col3'],
        data: [
          {'col1': 'newValue', 'col2': 'newValue', 'col3': 'newValue'},
          {'col1': 'x2', 'col2': 'y2', 'col3': 'z2'},
          {'col1': 'x3', 'col2': 'y3', 'col3': 'z3'},
          {'col1': 'x4', 'col2': 'y4', 'col3': 'z4'},
        ],
        draw: 2,
        recordsTotal: 4,
        recordsFiltered: 4,
      };
      const expectedNewData = {
        data: [
          {'col1': 'newValue', 'col2': 'newValue', 'col3': 'newValue'},
          {'col1': 'x2', 'col2': 'y2', 'col3': 'z2'},
          {'col1': 'x3', 'col2': 'y3', 'col3': 'z3'},
          {'col1': 'x4', 'col2': 'y4', 'col3': 'z4'},
        ],
        draw: 2,
        recordsTotal: 4,
        recordsFiltered: 4
      };
      storage.refresh(newData);
      expect($scope.tableColumns.displayed()).toEqual(expectedColumns);
      expect($scope.tableData).toEqual(expectedNewData);
    });

    it('Should evoke toaster service on pagination error', function (){
      spyOn(ToasterServiceFake, 'addToast').and.callThrough();
      const errorMessage = 'Request failed: Interpreter session is not running, please rerun the paragraph!';
      const errorJson = { error: true, message: errorMessage};
      storage.refresh(errorJson);
      expect(ToasterServiceFake.addToast.calls.any());
    });
  });
});
