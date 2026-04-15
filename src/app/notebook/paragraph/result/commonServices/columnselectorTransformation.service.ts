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
angular.module('zeppelinWebApp.columnselectorTransformation', [])
  .service('columnselectorTransformationsService', [columnselectorTransformationsService]);

//this is a refactoring of columnselector.js into a service
//it includes a settings preparation and data transformation
function columnselectorTransformationsService() {

  const self = this;
  //takes the main config, defaults the fields if there is none or set them with correct input
  //for the settings panel
  self.getColumnselectorSetting = function(config) {
    const configObj = config;

    //a compatibility layer for new drag&drop component
    const zones = [
      {
        id: 'xAxis',
        content: [],
        aggr: false,
        limit: 1,
      },
      {
        id: 'yAxis',
        content: [],
        aggr: false,
        limit: 1,
      },
      {
        id: 'group',
        content: [],
        aggr: false,
        limit: 1,
      },
      {
        id: 'size',
        content: [],
        aggr: false,
        limit: 1,
      },
    ];
    //each group can have only 1 field
    zones.map(zone =>{
      if(configObj[zone.id]) {
        const newField = configObj[zone.id];
        if (!newField['UUID']) {
          newField['UUID'] = Date.now() - Math.round(Math.random() * 1000);
        }
        zone.content.push(newField);
        //if there is a field with name of the group - push it to the content of the group
      }
    });

    return zones;
  };

  /**
   * Taken from legacy code, left for backward compatibility
   * Method will be invoked when tableData or config changes
   * what does this code even do???
   * it does not modify tabledata, only set some fields in the config as null
   */
  self.columnselectorTransform = function(tableData, config) {
    for (const f in config) {
      if (config[f]) {
        let found = false;
        for (let i = 0; i < tableData.columns.length; i++) {
          const a = config[f];
          const b = tableData.columns[i];
          if (a.index === b.index && a.name === b.name) {
            found = true;
            break;
          }
        }
        if (!found && config[f] instanceof Object && !(config[f] instanceof Array)) {
          config[f] = null;
        }
      }
    }
    return tableData;
  };
}
