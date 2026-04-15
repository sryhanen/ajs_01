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
import angular from 'angular';
import JsonTable from '../../../../shared/objects/display/json-datatable/jsonTable';
import PaginationRequest from '../../../../shared/objects/communication/paginationRequest';
import JsonTableData from '../../../../shared/objects/display/json-datatable/jsonTableData';
import ParsedJson from '../../../../shared/objects/utility/parsedJson';
import PaginationServerError from '../../../../shared/objects/display/json-datatable/paginationServerError';
import Pagination from '../../../../shared/objects/display/json-datatable/pagination';

angular.module('zeppelinWebApp.vizJsonTable')
  .controller('JsonTableCtrl', [
    '$scope',
    '$timeout',
    '$compile',
    'vizRegisterService',
    'websocketMsgSrv',
    'ToasterService',
    JsonTableCtrl,
  ])
  .directive('callback', [callbackDir]
  );

function callbackDir() {
  return function(scope) {
    scope.$evalAsync(function() {
      scope.initViz();
    });
  };
}

function JsonTableCtrl(
  $scope,
  $timeout,
  $compile,
  vizRegisterService,
  websocketMsgSrv,
  ToasterService
){

  // Variables for angular template
  $scope.loaded = false;
  $scope.containerID = '';

  // Variables for jsonTableWrapper
  $scope.tableData = {};
  $scope.tableColumns = [];
  $scope.jsonTableID = '';
  $scope.paginationRequest = {};
  $scope.pagination = new Pagination();

  const recreateDomTable = function(){
    // Remove the previous table entirely from dom.
    $scope.jsonTable.purgeTable();

    // Container and tableDomAnchor variables matches html elements defined in jsonTable.html -template.
    const container = angular.element(document.getElementById(`${$scope.containerID}_viz`));
    const tableDomAnchor = '<table id="' + $scope.jsonTableID +  '" class="table table-bordered table-striped"></table>';

    // Attach <table> back to container.
    container.append(tableDomAnchor);

    // Signal angularjs to process new bindings.
    $compile(tableDomAnchor)($scope);
  };

  const updateTableData = function(jsonObject) {
    const jsonTableData  = new JsonTableData(jsonObject);
    $scope.tableColumns = jsonTableData.tableColumns();
    $scope.tableData = jsonTableData.tableData();
    if($scope.tableData.draw === 1){
      $scope.pagination = new Pagination();
      $scope.selectedColumns = $scope.tableColumns.defaultVisible();

      // DataTables.net don't always work together on DOM updates.
      // Remove entirely previous table instance and re-attach table -element
      // for datatables.net to be used as an anchor.
      if($scope.jsonTable !== undefined){
        recreateDomTable();
      }
    }
    else if($scope.jsonTable !== undefined){
      $scope.pagination = new Pagination($scope.jsonTable.pagination());
      const visibleColumnState = $scope.jsonTable.visibleColumns();
      $scope.selectedColumns = $scope.tableColumns.visible(visibleColumnState);
    }
  };

  const refresh = function(data) {
    const jsonObject = new ParsedJson(data).jsonObject();
    const paginationServerError = new PaginationServerError(jsonObject);
    if(paginationServerError.error()){
      const message = paginationServerError.message();
      ToasterService.addToast(message, 'Danger');
      console.error(message);
    }
    else{
      updateTableData(jsonObject);
    }

    // Wrapping in timeout is a safer way to ensure angularJs allows datatables.net to apply changes to DOM.
    $timeout(function() {
      $scope.jsonTable.create($scope.tableColumns, $scope.tableData, $scope.pagination, $scope.selectedColumns);
    });
  };

  $scope.initResult = function(id, index, data) {
    $scope.containerID = `${id}_${index}`;
    $scope.jsonTableID = `${$scope.containerID}_JsonTable`;
    const jsonObject = new ParsedJson(data).jsonObject();
    updateTableData(jsonObject);
    vizRegisterService.linkUpdateViz(id, index, refresh);
    $scope.loaded = true;
  };

  $scope.initViz = function() {
    // Abuse angular module inheritance via prototype.
    // Scope variables noteId, paragraphId are set in result controller on updateParagraphOutput event.
    // Currently, there isn't a workaround for this.
    $scope.paginationRequest = new PaginationRequest($scope.noteId, $scope.paragraphId, websocketMsgSrv);
    $scope.jsonTable = new JsonTable($scope.jsonTableID, $scope.paginationRequest);
    $scope.jsonTable.create($scope.tableColumns, $scope.tableData, $scope.pagination);
  };
}
