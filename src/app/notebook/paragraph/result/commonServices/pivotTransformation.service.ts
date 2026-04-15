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

angular.module('zeppelinWebApp.pivotTransformation', [])
  .service('pivotTransformationsService', [pivotTransformationsService]);

//this is a refactoring of pivot.js into a service
//it includes a settings preparation and data transformation
function pivotTransformationsService() {

  const self = this;
  //pivot section

  self.pivotTransform = function (configInput, tableData) {


    const tableDataColumns = tableData.columns;
    configInput.common = configInput.common || {};
    configInput.common.pivot = configInput.common.pivot || {};
    let config = configInput.common.pivot;
    const firstTime = !config.keys && !config.groups && !config.values;

    config.keys = config.keys || [];
    config.groups = config.groups || [];
    config.values = config.values || [];

    config = self.removeUnknown(config, tableDataColumns);
    if (firstTime) {
      config = self.selectDefault(config, tableDataColumns);
    }

    return self.pivot(
      tableData,
      config.keys,
      config.groups,
      config.values
    );
  };

  self.removeUnknown = function (configInput, tableDataColumns) {
    const config = configInput;
    const unique = function(list) {
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          if (angular.equals(list[i], list[j])) {
            list.splice(j, 1);
            j--;
          }
        }
      }
    };

    const removeUnknown = function(list) {
      for (let i = 0; i < list.length; i++) {
        // remove non existing column
        let found = false;
        for (let j = 0; j < tableDataColumns.length; j++) {
          const a = list[i];
          const b = tableDataColumns[j];
          if (a.index === b.index && a.name === b.name) {
            found = true;
            break;
          }
        }
        if (!found) {
          list.splice(i, 1);
        }
      }
    };

    unique(config.keys);
    removeUnknown(config.keys);
    unique(config.groups);
    removeUnknown(config.groups);
    removeUnknown(config.values);
    return config;
  };

  self.selectDefault = function (configInput, tableDataColumns) {
    const config = configInput;
    if (config.keys.length === 0 &&
      config.groups.length === 0 &&
      config.values.length === 0) {
      if (config.keys.length === 0 && tableDataColumns.length > 0) {
        config.keys.push(tableDataColumns[0]);
      }
      if (config.values.length === 0 && tableDataColumns.length > 1) {
        config.values.push(tableDataColumns[1]);
      }
    }
    return config;
  };

  const isValidNumber = function(num) {
    return num !== undefined && !isNaN(num);
  };

  //setting up aggregations (legacy code)
  self.pivot = function (data, keys, groups, values) {
    const aggrFunc = {
      sum: function(a, b) {
        const varA = a !== undefined ? isNaN(a) ? 0 : parseFloat(a) : 0;
        const varB = b !== undefined ? isNaN(b) ? 0 : parseFloat(b) : 0;
        return varA + varB;
      },
      count: function(a, b) {
        const varA = a !== undefined ? parseInt(a) : 0;
        const varB = b !== undefined ? 1 : 0;
        return varA + varB;
      },
      min: function(a, b) {
        const aIsValid = isValidNumber(a);
        const bIsValid = isValidNumber(b);
        if (!aIsValid) {
          return parseFloat(b);
        } else if (!bIsValid) {
          return parseFloat(a);
        } else {
          return Math.min(parseFloat(a), parseFloat(b));
        }
      },
      max: function(a, b) {
        const aIsValid = isValidNumber(a);
        const bIsValid = isValidNumber(b);
        if (!aIsValid) {
          return parseFloat(b);
        } else if (!bIsValid) {
          return parseFloat(a);
        } else {
          return Math.max(parseFloat(a), parseFloat(b));
        }
      },
      avg: function(a, b, c) {
        const varA = a !== undefined ? isNaN(a) ? 0 : parseFloat(a) : 0;
        const varB = b !== undefined ? isNaN(b) ? 0 : parseFloat(b) : 0;
        return varA + varB; //is this even correct?
      },
    };

    const aggrFuncDiv = {
      sum: false,
      count: false,
      min: false,
      max: false,
      avg: true,
    };

    const schema = {};
    const rows = {};

    for (let i = 0; i < data.rows.length; i++) {
      const row = data.rows[i];
      let s = schema;
      let p = rows;

      for (let k = 0; k < keys.length; k++) {
        const key = keys[k];

        // add key to schema
        if (!s[key.name]) {
          s[key.name] = {
            order: k,
            index: key.index,
            type: 'key',
            children: {},
          };
        }
        s = s[key.name].children;

        // add key to row
        const keyKey = row[key.index];
        if (!p[keyKey]) {
          p[keyKey] = {};
        }
        p = p[keyKey];
      }

      for (let g = 0; g < groups.length; g++) {
        const group = groups[g];
        const groupKey = row[group.index];

        // add group to schema
        if (!s[groupKey]) {
          s[groupKey] = {
            order: g,
            index: group.index,
            type: 'group',
            children: {},
          };
        }
        s = s[groupKey].children;

        // add key to row
        if (!p[groupKey]) {
          p[groupKey] = {};
        }
        p = p[groupKey];
      }

      for (let v = 0; v < values.length; v++) {
        const value = values[v];
        const valueKey = `${value.name}(${value.aggr})`;

        // add value to schema
        if (!s[valueKey]) {
          s[valueKey] = {
            type: 'value',
            order: v,
            index: value.index,
          };
        }

        // add value to row
        if (!p[valueKey]) {
          p[valueKey] = {
            value: value.aggr !== 'count' ? row[value.index] : 1,
            count: 1,
          };
        } else {
          p[valueKey] = {
            value: aggrFunc[value.aggr](p[valueKey].value, row[value.index], p[valueKey].count + 1),
            count: aggrFuncDiv[value.aggr] ? p[valueKey].count + 1 : p[valueKey].count,
          };
        }
      }
    }


    return {
      keys: keys,
      groups: groups,
      values: values,
      schema: schema,
      rows: rows,
    };
  };

  self.getPivotSetting = function (config) {
    const configObj = config;

    const defaultPivot = {
      pivot: {
        keys:[],
        groups:[],
        values:[]
      }
    };
    if (!configObj.common){

      configObj.common = angular.copy(defaultPivot);
    }

    if(!configObj.common.pivot){

      configObj.common.pivot = angular.copy(defaultPivot.pivot);
    }
    const zoneNames = Object.keys(configObj.common.pivot);
    //compatibility layer for the new drag&drop component
    //setting up the groups
    const zones = zoneNames.map(zone =>{
      const item = {id:'', content:[], aggr:false, limit: 0};
      item['id'] = zone;
      if (configObj.common.pivot[zone].length >0){
        item['content'] = configObj.common.pivot[zone].map(item =>{
          if(!item['UUID']){
            item['UUID'] = Date.now() - Math.round(Math.random()*1000);
          }
          return item;
        });
      }else{
        item['content'] = [];
      }
      if(zone === 'values'){ //hardcoded for now, because server does not tell that
        item['aggr'] = true;
      }else{
        item['aggr'] = false;
      }
      item['limit'] = 0;
      return item;
    });

    return zones;
  };
}
