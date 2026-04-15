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
import _ from 'lodash';

angular.module('zeppelinWebApp.networkParser', [])
  .service('networkParserService', [networkParserService]);

//this is a refactoring of networkData.js into a service
//it includes a result parsing and setting up network-related options
function networkParserService() {

  const self = this;

  /**
   * Create network data object from paragraph graph type result
   */

  self.loadNetworkResult = function (data) {

    const networkData = {
      columns: [],
      rows: [],
      comment: '',
      graph: {
        nodes: undefined,
        labels: undefined,
        edges: undefined,
        types: undefined,
        lablesOrig: undefined,
      },
      networkNodes: undefined,
      networkRelationships: undefined
    };

    networkData.graph = JSON.parse(data.trim() || '{}');


    if (!networkData.graph.nodes) {

      return;
    }
    const labels = collectLabels(networkData.graph.nodes);
    //potential solution to the issue #195. Not working yet, but uses default variant instead.
    if (Object.keys(labels).length > 0){

      if (!angular.equals({}, networkData.graph.lablesOrig || {})){
        if (!angular.equals(networkData.graph.lablesOrig, labels)){

          networkData.graph.labels = labels;
          networkData.graph.lablesOrig = labels;
        }
      }else {

        networkData.graph.labels = labels;
        networkData.graph.lablesOrig = labels;
      }
    }

    if (!angular.equals({}, networkData.graph.labels || {})){
      const size = Object.keys(networkData.graph.labels).length;
      const colorSet = randomColorSet(size);
      let i = 0;
      for (const [key, value] of Object.entries(networkData.graph.labels)) {
        networkData.graph.labels[key] = colorSet[i];
        i++;
      }
    }
    networkData.graph.edges = networkData.graph.edges || [];
    networkData.networkNodes = angular.equals({}, networkData.graph.labels || {})
      ? null : {count: networkData.graph.nodes.length, labels: networkData.graph.labels};
    networkData.networkRelationships = angular.equals([], networkData.graph.types || [])
      ? null : {count: networkData.graph.edges.length, types: networkData.graph.types};

    const rows = [];
    const comment = '';
    const entities = networkData.graph.nodes.concat(networkData.graph.edges);
    const baseColumnNames = [{name: 'id', index: 0, aggr: 'sum'}];
    const containsLabelField = _.find(entities, (entity) => 'label' in entity) !== undefined;
    if (networkData.graph.labels || networkData.graph.types || containsLabelField) {
      baseColumnNames.push({name: 'label', index: 1, aggr: 'sum'});
    }
    const internalFieldsToJump = ['count', 'size', 'totalCount',
      'data', 'x', 'y', 'labels', 'source', 'target'];
    const baseCols = _.map(baseColumnNames, (col) => col.name);
    let keys:any = _.map(entities, (elem) => Object.keys(elem.data || {}));
    keys = _.flatten(keys);
    keys = _.uniq(keys).filter((key:any) => baseCols.indexOf(key) === -1);
    const entityColumnNames = _.map(keys, (elem, i) => {
      return {name: elem, index: i + baseColumnNames.length, aggr: 'sum'};
    });
    const columnNames = baseColumnNames.concat(entityColumnNames);
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const col = [];
      entity.data = entity.data || {};
      for (let j = 0; j < columnNames.length; j++) {
        const name = columnNames[j].name;
        const value = name in entity && internalFieldsToJump.indexOf(name) === -1
          ? entity[name] : entity.data[name];
        const parsedValue = value === null || value === undefined ? '' : value;
        col.push(parsedValue);
      }
      rows.push(col);
    }


    networkData.comment = comment || '';
    networkData.columns = columnNames || [];
    networkData.rows = rows || [];

    return networkData;
  };

  //this is used for setting network elements into our color palette.
  //Adding more colors will add variety to the network viz color scheme.
  //NB! This will make some unit tests to fail
  const colorPalette = [
    'indigo',
    'lilac',
    'mint',
  ];

  //utility functions to randomize colors and create labels

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function randomColorSet(number){
    const fullArray = [];
    colorPalette.map(color =>{
      for (let i = 1; i < 9; i++) {
        fullArray.push(`${color}-${i}00`);
      }
    });
    const endArray = [];
    for (let i = 0; i < number; i++) {
      if(fullArray.length > 0){
        const pos = getRandomInt(fullArray.length - 1);
        endArray.push(fullArray[pos]);
        fullArray.splice(pos, 1);
      }else {
        endArray.push('default-color');
      }
    }
    return endArray;
  };

  function collectLabels(arrayOfNodes) {
    const lablesList = [];
    const returnObject = {};
    arrayOfNodes.map(node => {
      if(!lablesList.includes(node.label)&&node.label !== undefined){
        lablesList.push(node.label);
        returnObject[node.label] = '';
      }
    });
    return returnObject;
  }
}
