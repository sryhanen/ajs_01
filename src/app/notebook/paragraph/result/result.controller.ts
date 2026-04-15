/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import angular from 'angular';
import moment from 'moment';
import {DisplayType} from '../../../shared/objects/display/displayType';
import {ParagraphStatus} from '../paragraph.status';

import {AnsiUp} from 'ansi_up';
const AnsiUpConverter = new AnsiUp();

angular.module('zeppelinWebApp.newResult', [
  'zeppelinWebApp.comBaseURL',
  'zeppelinWebApp.notebook',
  'zeppelinWebApp.vizRegister',
])
  .controller('NewResultCtrl', [
    '$scope',
    '$rootScope',
    '$compile',
    'websocketMsgSrv',
    'saveAsService',
    'vizRegisterService',
    'tableParserService',
    'networkParserService',
    'ToasterService',
    ResultCtrl
  ]);

function ResultCtrl($scope,
                    $rootScope,
                    $compile,
                    websocketMsgSrv,
                    saveAsService,
                    vizRegisterService,
                    tableParserService,
                    networkParserService,
                    ToasterService
) {

  //init vars
  const vizRegister = vizRegisterService;
  let paragraph = null;
  let config: {
    graph: {
      keys: unknown;
      commonSetting: {
        pivot:{
          keys:unknown,
          groups:unknown,
          values:unknown
        }
      },
      setting: unknown;
      mode: string;
      groups: unknown;
      values: unknown;
    }
  };
  let containerString = null;
  let viz = undefined;

  $scope.data = {};
  $scope.vizConfig = {};
  $scope.index = null;
  $scope.type = null; //this is data type
  $scope.id = null;
  $scope.switcher = null;
  $scope.activeViz = null; //this is graph_mode / viz_type
  $scope.inclusionpath = '';
  $scope.controllerName = '';
  $scope.settingsOpen = true;
  $scope.settings = false;

  /** init function
  it splits the paragraph object in the small chunks,
   sets them to the scope vars and feeds components with them.
   some chunks go through defaulting
   */
  $scope.init = function (paragraphRef, noteId, indexInput) {

    $scope.paragraphId = paragraphRef.id;
    $scope.noteId = noteId;
    paragraph = paragraphRef;
    $scope.index = indexInput;
    $scope.id = paragraphRef.id;
    containerString = `${paragraphRef.id}_${indexInput}`;
    config = paragraphRef.config.results[indexInput]; //raw config


    $scope.data = paragraphRef.results.msg[indexInput].data;
    $scope.type = paragraphRef.results.msg[indexInput].type;
    $scope.status = paragraphRef.results.code;
    $scope.activeViz = typeNormalizer(paragraphRef);
    $scope.vizConfig = getVizConfig(); // processed config


    viz = vizRegister.getViz($scope.activeViz);
    $scope.settings = viz.hasSettings;

    if (viz.id !== $scope.activeViz){
      $scope.activeViz = viz.id.toString();
    }
    //set a callback to save configs
    vizRegister.linkEmitConfig($scope.id, $scope.index, commitVizConfigChange);
    $scope.inclusionpath = viz.inclusion.toString();
    $scope.controllerName = viz.controllerName.toString();

    setupSwitcher();
    //once container is fully loaded, run:
    angular.element(function () {

      createContainer();
    });

  };

  function setupSwitcher() {
    const switchList = vizRegister.getList($scope.type);

    if(switchList.length > 0){
      $scope.switcher = switchList.map(element =>{
        return vizRegister.getViz(element).getButton();
      });
    }else{
      $scope.switcher = {};
    }

  }

  function createContainer() {
    const container = angular.element(`#${containerString}`);
    const resultTemplate = '<div ng-include="inclusionpath" ' +
      `ng-controller="${$scope.controllerName}"` +
      'ng-init="initResult(id, index, data, vizConfig, emitConfig)"></div>';
    const compilation = $compile(resultTemplate)($scope);
    container.append(compilation);

  }

  $scope.$on('ClearResults', () => {
    $scope.switcher = null;
    clearContainer();
  });

  function updateContainer() {
    $scope.vizConfig = getVizConfig();
    if($scope.data !== ''){
      vizRegister.updateViz($scope.id, $scope.index, $scope.data, $scope.vizConfig);
    }else{
      ToasterService.addToast('Update for empty data requested, aborting', 'Danger');
    }
  }

  function clearContainer() {
    const container = angular.element(`#${containerString}`);
    container.empty();
  }

  //called when a viz needs switching, makes a full recreation of the container
  $scope.switchViz = function (vizID){
    viz = vizRegister.getViz(vizID);
    $scope.settings = viz.hasSettings;
    $scope.activeViz = viz.id;
    if(!config){
      config = {
        graph:{
          mode:viz.id,
          setting:undefined,
          groups:undefined,
          values:undefined,
          commonSetting:undefined,
          keys:undefined
        },
      };
    }
    //all this in case data comes incomplete (and that indeed happens)
    if(paragraph.config.results[$scope.index]){
      if(paragraph.config.results[$scope.index].graph){
        paragraph.config.results[$scope.index].graph.mode = viz.id;
      }else{
        paragraph.config.results[$scope.index].graph = {mode: viz.id};
      }
    }else{
      paragraph.config.results[$scope.index] = {graph: {mode: viz.id}};
    }
    clearContainer();
    setupSwitcher();
    $scope.vizConfig = getVizConfig();
    $scope.inclusionpath = viz.inclusion.toString();
    $scope.controllerName = viz.controllerName.toString();
    createContainer();
    sendConfig(paragraph.config);

  };

  $scope.toggleGraphSetting = function(){
    $scope.settingsOpen = !$scope.settingsOpen;
  };

  //legacy code
  $scope.exportToDSV = function(delimiter) {
    let dsv = '';
    const dateFinished = moment(paragraph.dateFinished).format('YYYY-MM-DD hh:mm:ss A');
    const exportedFileName = paragraph.title ? `${paragraph.title}_${dateFinished}` : `data_${dateFinished}`;
    let tableData;
    if($scope.type === 'NETWORK'){
      tableData = networkParserService.loadNetworkResult($scope.data);
    }else if($scope.type === 'TABLE'){
      tableData = tableParserService.loadTableResult($scope.data);
    }else {
      console.warn('The data type has no matching data parser: ');
      return;
    }
    for (const titleIndex in tableData.columns) {
      if (Object.prototype.hasOwnProperty.call(tableData.columns, titleIndex)) {
        dsv += tableData.columns[titleIndex].name + delimiter;
      }
    }
    dsv = `${dsv.substring(0, dsv.length - 1)}\n`;
    for (const r in tableData.rows) {
      if (Object.prototype.hasOwnProperty.call(tableData.rows, r)) {
        const row = tableData.rows[r];
        let dsvRow = '';
        for (const index in row) {
          if (Object.prototype.hasOwnProperty.call(row, index)) {
            const stringValue = row[index].toString();
            if (stringValue.indexOf(delimiter) > -1) {
              dsvRow += `"${stringValue}"${delimiter}`;
            } else {
              dsvRow += row[index] + delimiter;
            }
          }
        }
        dsv += `${dsvRow.substring(0, dsvRow.length - 1)}\n`;
      }
    }
    let extension = '';
    if (delimiter === '\t') {
      extension = 'tsv';
    } else if (delimiter === ',') {
      extension = 'csv';
    }
    saveAsService.saveAs(dsv, exportedFileName, extension);
  };

  //a marvelous piece of config mangling. Take from there, put here, delete, recreate.
  //without that no compatibility with server
  const getVizConfig = function() {
    //if an important piece of config is not defined - abort
    if (typeof config === 'undefined'){

      config = {
        graph:{
          setting:undefined,
          mode:undefined,
          commonSetting:undefined,
          keys:undefined,
          groups:undefined,
          values: undefined,
        }
      };
      config.graph.setting = {};
      config.graph.setting[$scope.activeViz] = {};
    }
    let newConfig; //an undefined var
    //full-instance copy of only the graph section
    const graph = angular.copy(config.graph);

    // copy only setting with current vizId
    if (graph.setting) {
      newConfig = angular.copy(graph.setting[$scope.activeViz]);
    }

    //if newConfig is still undefined - define as an empty object
    if (!newConfig) {
      newConfig = {};
    }

    // copy common setting
    newConfig.common = angular.copy(graph.commonSetting) || {};

    // copy pivot data
    if (graph.keys) {

      newConfig.common.pivot = {};
      newConfig.common.pivot.keys = angular.copy(graph.keys);
      newConfig.common.pivot.groups = angular.copy(graph.groups);
      newConfig.common.pivot.values = angular.copy(graph.values);
    }


    return newConfig;
  };

  //and now combine all abowe back to send it
  const commitVizConfigChange = function(vizconfig) {
    if(!vizconfig){
      return;
    }
    //allow commit only if paragraph is not running or pending. If status is ERROR - should work
    if ([ParagraphStatus.RUNNING, ParagraphStatus.PENDING].indexOf(paragraph.status) < 0) {
      //a template of new config, created from a copy of old one
      const newConfig = angular.copy(config);
      if (!newConfig.graph) {
        newConfig.graph = {
          setting:undefined,
          mode:undefined,
          commonSetting:undefined,
          keys:undefined,
          groups:undefined,
          values: undefined,
        };
      }
      // copy setting for vizId
      if (!newConfig.graph.setting) {
        newConfig.graph.setting = {};
      }

      const vizId = $scope.activeViz;
      //copy input config into specific graph config setting
      newConfig.graph.setting[vizId] = angular.copy(vizconfig);
      //copy common setting into the root of graph setting and delete them from specific setting
      newConfig.graph.commonSetting = newConfig.graph.setting[vizId].common;
      delete newConfig.graph.setting[vizId].common;
      //copy pivot data from common settings of the new config to corresponding subobjects in the root and delete originals
      if (newConfig.graph.commonSetting && newConfig.graph.commonSetting.pivot) {
        newConfig.graph.keys = newConfig.graph.commonSetting.pivot.keys;
        newConfig.graph.groups = newConfig.graph.commonSetting.pivot.groups;
        newConfig.graph.values = newConfig.graph.commonSetting.pivot.values;
        delete newConfig.graph.commonSetting.pivot;
      }

      //now applying new config onto a copy of paragraph config object
      const newParagraphConfig = angular.copy(paragraph.config);
      //defaulting, defaulting, defaulting
      newParagraphConfig.results = newParagraphConfig.results || [];
      newParagraphConfig.results[$scope.index] = newConfig;
      //set it for the local use as well
      config = newConfig;
      //update with new local config
      updateContainer();

      //if it is not a revision - send the new config
      if ($scope.revisionView !== true && !$scope.viewOnly) {
        sendConfig(newParagraphConfig);
      }
    }

  };

  //just a simple websocket call to send config
  const sendConfig = function (newConfig){

    const params = angular.copy(paragraph.settings.params);
    return websocketMsgSrv.commitParagraph(paragraph.id, paragraph.title, paragraph.text, newConfig, params);
  };

  //trigges from paragraph.controller
  $scope.$on('updateResult', function(event, result, newConfig, paragraphRef, index) {

    if (paragraph.id !== paragraphRef.id || index !== $scope.index) {

      return;
    }
    const newData = result.data;

    if(angular.equals(config, newConfig) && angular.equals(newData, $scope.data)){

      return;
    }
    config = newConfig;
    $scope.data =  newData;
    $scope.status = paragraphRef.results.code;
    //the type issue needs to be resolved on the server side
    let type = result.type;
    if ($scope.type !== type){

      $scope.type = type.toString();
      if(type === 'TABLE' || type === 'NETWORK'){
        type = 'table';
      }
      $scope.switchViz(type);
      return;
    }

    updateContainer();
  });

  //copied from result.controller. This is no good code, but kept for compatibility
  $scope.$on('appendParagraphOutput', function(event, data) {
    if (paragraph.id === data.paragraphId &&
      $scope.index === data.index) {
      if(paragraph.status === ParagraphStatus.PENDING ||
        paragraph.status === ParagraphStatus.RUNNING) {
        // Check if result type is eiter TEXT or TABLE, if not then treat it like TEXT
        if ([DisplayType.TEXT, DisplayType.TABLE].indexOf($scope.type) < 0) {
          //questionable
          return;
        }
        if ($scope.type === DisplayType.TEXT) {
          appendTextOutput(data.data);
        } else if ($scope.type === DisplayType.TABLE) {
          appendTableOutput(data);
        }
      }
      if (paragraph.status === ParagraphStatus.FINISHED &&
        $scope.type === DisplayType.TABLE) {
        appendTableOutput(data);//possibly never-executed lines
      }
    }
  });

  const appendTableOutput = function (data) {
    //this is checked before, might be redundant
    if (ParagraphStatus.FINISHED !== paragraph.status) {

      const newData = $scope.data.concat(data.data);

      paragraph.results.msg[data.index].data = newData;
      $scope.data = newData;
      updateContainer();
    }
  };

  const appendTextOutput = function (data) {
    $scope.data = $scope.data + AnsiUpConverter.ansi_to_html(data);
    paragraph.results.msg[$scope.index].data = $scope.data;
    updateContainer();
  };

  //a hack to combine data type and graph type together.
  // Should be resolved on the server side later
  const typeNormalizer = function (paragraph) {
    const type = paragraph.results.msg[$scope.index].type;
    if(type === 'TABLE' || type === 'NETWORK'){
      try{
        return paragraph.config.results[$scope.index].graph.mode;
      }catch (e) {
        console.warn(`Visualization mode set to table due to error: ${e.message}`);
        return 'table';
      }
    }else {
      return type;
    }
  };
}
