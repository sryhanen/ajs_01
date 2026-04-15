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
import NetworkVisualization from './visualization-d3network';

angular.module('zeppelinWebApp.vizNetwork')
  .directive('callback', [callbackDir]
  )
  .controller('NetworkCtrl', [
    '$scope',
    'vizRegisterService',
    'networkParserService',
    NetworkCtrl
  ]);

//this is a directive component, that will call initViz once Angular finish loading it.
//more effective than endless checking loop to ensure that container is ready
function callbackDir() {
  return function (scope, element, attrs) {

    scope.initViz(element);
  };
}

function NetworkCtrl(
  $scope,
  vizRegisterService,
  networkParserService,
) {

  $scope.loaded = false;

  let viz;
  let tableData;
  let ownId;
  let ownIndex;

  const refresh = function (newData, newConfig){

    $scope.vizConfig = newConfig;
    tableData = networkParserService.loadNetworkResult(newData);

    $scope.tableDataColumns = tableData.columns;
    $scope.tableDataComment = tableData.comment;
    $scope.networkNodes = tableData.networkNodes;
    $scope.networkNodes = tableData.networkNodes;
    $scope.networkRelationships = tableData.networkRelationships;
    $scope.networkProperties = tableData.networkProperties;
    $scope.networkRelationships = tableData.networkRelationships;
    $scope.networkProperties = tableData.networkProperties;
    viz.setConfig(newConfig);
    viz.render(tableData);
  };

  /** this function must be in every VIZ controller
  id = paragraph.id
  index = index of the result
  data = paragraph.results.msg[index].data
  vizConfig = paragraph.config.result[index].graph + stuff
  */
  $scope.initResult = function (id, index, data,  vizConfig) {
    //set up all data
    ownId = id;
    ownIndex = index;
    $scope.containerID = `${id}_${index}`;
    $scope.vizConfig = vizConfig;
    tableData = networkParserService.loadNetworkResult(data);

    $scope.tableDataColumns = tableData.columns;
    $scope.tableDataComment = tableData.comment;
    $scope.networkNodes = tableData.networkNodes;
    $scope.networkRelationships = tableData.networkRelationships;
    $scope.networkProperties = tableData.networkProperties;
    //all modules must set up an update callback at the register
    vizRegisterService.linkUpdateViz(id, index, refresh);
    $scope.loaded = true;
  };

  //connection to the correct instance of result.controller
  $scope.saveConfig = function (){

    vizRegisterService.emitConfig(ownId, ownIndex, viz.config);
  };

  //function is needed for the viz to function
  $scope.isEmptyObject = function(obj) {
    obj = obj || {};
    return angular.equals(obj, {});
  };

  //network setting callback
  $scope.setNetworkLabel = function(label, value) {
    viz.config.properties[label].selected = value;
  };

  $scope.initViz = function (element) {
    //when ready - render
    if(!viz) {
      const vizID = `${$scope.containerID}_viz`;
      element[0].id = vizID;
      viz = new NetworkVisualization(element, $scope.vizConfig);
      $scope.config = viz.config;
      viz.render(tableData);

    }
  };


}
