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

angular.module('zeppelinWebApp.tableParser', [])
  .service('tableParserService', [tableParserService]);

//this is a refactoring of tabledata.js into a service
//it includes a custom result parsing for the specifically formatted result string
function tableParserService() {

  const self = this;

  //table data section

  self.loadTableResult = function(data) {

    const tabledata = {
      columns: [],
      rows: [],
      comment: '',
    };
    const columnNames = [];
    const rows = [];
    const textRows = data.split('\n');
    let comment = '';
    let commentRow = false;
    const float64MaxDigits = 16;

    for (let i = 0; i < textRows.length; i++) {
      const textRow = textRows[i];

      if (commentRow) {
        comment += textRow;
        continue;
      }

      if (textRow === '' || textRow === '<!--TABLE_COMMENT-->') {
        if (rows.length > 0) {
          commentRow = true;
        }
        continue;
      }
      const textCols = textRow.split('\t');
      const cols = [];
      for (let j = 0; j < textCols.length; j++) {
        let col = textCols[j];
        if (i === 0) {
          columnNames.push({name: col, index: j, aggr: 'sum'});
        } else {
          let valueOfCol;
          if (!(col[0] === '0' || col[0] === '+' || col.length > float64MaxDigits)) {
            if (!isNaN(valueOfCol = col) && isFinite(col)) {
              col = valueOfCol;
            }
          }
          cols.push(col);
        }
      }
      if (i !== 0) {
        rows.push(cols);
      }
    }
    tabledata.comment = comment;
    tabledata.columns = columnNames;
    tabledata.rows = rows;
    return tabledata;
  };
}
