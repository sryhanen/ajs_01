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

import Nvd3ChartVisualization from '../baseClasses/visualization-nvd3chart';

/**
 * Visualize data in scatter char
 */
export default class ScatterchartVisualization extends Nvd3ChartVisualization {
  private tableData;
  private xLabels;
  private yLabels;

  constructor(targetEl, config) {
    super(targetEl, config);
  }

  type() {
    return 'scatterChart';
  }

  render(tableData) {
    this.tableData = tableData;
    this.selectDefault();
    const d3Data = this.setScatterChart(tableData, true);
    this.xLabels = d3Data.xLabels;
    this.yLabels = d3Data.yLabels;

    super.render(d3Data);
  }

  configureChart(chart) {
    const self = this;

    chart.xAxis.tickFormat(function(d) { // TODO remove round after bump to nvd3 > 1.8.5
      return self.xAxisTickFormat(Math.round(d * 1e3) / 1e3, self.xLabels);
    });

    chart.yAxis.tickFormat(function(d) { // TODO remove round after bump to nvd3 > 1.8.5
      return self.yAxisTickFormat(Math.round(d * 1e3) / 1e3, self.yLabels);
    });

    chart.showDistX(true).showDistY(true);
    // handle the problem of tooltip not showing when muliple points have same value.
  }

  yAxisTickFormat(d, yLabels) {
    if (yLabels[d] && (isNaN(parseFloat(yLabels[d])) || !isFinite(yLabels[d]))) { // to handle string type xlabel
      return yLabels[d];
    } else {
      return super.yAxisTickFormat(d);
    }
  }

  selectDefault() {
    if (!this.config.xAxis && !this.config.yAxis) {
      if (this.tableData.columns.length > 1) {
        this.config.xAxis = this.tableData.columns[0];
        this.config.yAxis = this.tableData.columns[1];
      } else if (this.tableData.columns.length === 1) {
        this.config.xAxis = this.tableData.columns[0];
      }
    }
  }

  setScatterChart(data, refresh) {
    const xAxis = this.config.xAxis;
    const yAxis = this.config.yAxis;
    const group = this.config.group;
    const size = this.config.size;

    const xValues = [];
    const yValues = [];
    let rows;
    const d3g = [];

    const rowNameIndex = {};
    const colNameIndex = {};
    const grpNameIndex = {};
    const rowIndexValue = {};
    const colIndexValue = {};
    const grpIndexValue = {};
    let rowIdx = 0;
    let colIdx = 0;
    let grpIdx = 0;
    let grpName = '';

    let xValue;
    let yValue;
    let row;

    if (!xAxis && !yAxis) {
      return {
        d3g: [],
      };
    }

    for (let i = 0; i < data.rows.length; i++) {
      row = data.rows[i];
      if (xAxis) {
        xValue = row[xAxis.index];
        xValues[i] = xValue;
      }
      if (yAxis) {
        yValue = row[yAxis.index];
        yValues[i] = yValue;
      }
    }

    const isAllDiscrete = xAxis && yAxis && this.isDiscrete(xValues) && this.isDiscrete(yValues) ||
    !xAxis && this.isDiscrete(yValues) ||
    !yAxis && this.isDiscrete(xValues);

    if (isAllDiscrete) {
      rows = this.setDiscreteScatterData(data);
    } else {
      rows = data.rows;
    }

    if (!group && isAllDiscrete) {
      grpName = 'count';
    } else if (!group && !size) {
      if (xAxis && yAxis) {
        grpName = `(${xAxis.name}, ${yAxis.name})`;
      } else if (xAxis && !yAxis) {
        grpName = xAxis.name;
      } else if (!xAxis && yAxis) {
        grpName = yAxis.name;
      }
    } else if (!group && size) {
      grpName = size.name;
    }

    const epsilon = 1e-4; // TODO remove after bump to nvd3 > 1.8.5

    for (let i = 0; i < rows.length; i++) {
      row = rows[i];
      if (xAxis) {
        xValue = row[xAxis.index];
      }
      if (yAxis) {
        yValue = row[yAxis.index];
      }
      if (group) {
        grpName = row[group.index];
      }
      const sz = isAllDiscrete ? row[row.length - 1] : size ? row[size.index] : 1;

      if (grpNameIndex[grpName] === undefined) {
        grpIndexValue[grpIdx] = grpName;
        grpNameIndex[grpName] = grpIdx++;
      }

      if (xAxis && rowNameIndex[xValue] === undefined) {
        rowIndexValue[rowIdx] = xValue;
        rowNameIndex[xValue] = rowIdx++;
      }

      if (yAxis && colNameIndex[yValue] === undefined) {
        colIndexValue[colIdx] = yValue;
        colNameIndex[yValue] = colIdx++;
      }

      if (!d3g[grpNameIndex[grpName]]) {
        d3g[grpNameIndex[grpName]] = {
          key: grpName,
          values: [],
        };
      }

      // TODO remove epsilon jitter after bump to nvd3 > 1.8.5
      let xval = 0;
      let yval = 0;
      if (xAxis) {
        xval = (isNaN(xValue) ? rowNameIndex[xValue] : parseFloat(xValue)) + Math.random() * epsilon;
      }
      if (yAxis) {
        yval = (isNaN(yValue) ? colNameIndex[yValue] : parseFloat(yValue)) + Math.random() * epsilon;
      }

      d3g[grpNameIndex[grpName]].values.push({
        x: xval,
        y: yval,
        size: isNaN(parseFloat(sz)) ? 1 : parseFloat(sz),
      });
    }

    // TODO remove sort and dedup after bump to nvd3 > 1.8.5
    const d3gvalues = d3g[grpNameIndex[grpName]].values;
    d3gvalues.sort(function(a, b) {
      return a['x'] - b['x'] || a['y'] - b['y'];
    });

    for (let i = 0; i < d3gvalues.length - 1;) {
      if (Math.abs(d3gvalues[i]['x'] - d3gvalues[i + 1]['x']) < epsilon &&
           Math.abs(d3gvalues[i]['y'] - d3gvalues[i + 1]['y']) < epsilon) {
        d3gvalues.splice(i + 1, 1);
      } else {
        i++;
      }
    }

    return {
      xLabels: rowIndexValue,
      yLabels: colIndexValue,
      d3g: d3g,
    };
  }

  setDiscreteScatterData(data) {
    const xAxis = this.config.xAxis;
    const yAxis = this.config.yAxis;
    const group = this.config.group;

    let xValue;
    let yValue;
    let grp;

    const rows = {};

    for (let i = 0; i < data.rows.length; i++) {
      const row = data.rows[i];
      if (xAxis) {
        xValue = row[xAxis.index];
      }
      if (yAxis) {
        yValue = row[yAxis.index];
      }
      if (group) {
        grp = row[group.index];
      }

      const key = `${xValue},${yValue},${grp}`;

      if (!rows[key]) {
        rows[key] = {
          x: xValue,
          y: yValue,
          group: grp,
          size: 1,
        };
      } else {
        rows[key].size++;
      }
    }

    // change object into array
    const newRows = [];
    for (const r in rows) {
      if (Object.prototype.hasOwnProperty.call(rows, r)) {
        const newRow = [];
        if (xAxis) {
          newRow[xAxis.index] = rows[r].x;
        }
        if (yAxis) {
          newRow[yAxis.index] = rows[r].y;
        }
        if (group) {
          newRow[group.index] = rows[r].group;
        }
        newRow[data.rows[0].length] = rows[r].size;
        newRows.push(newRow);
      }
    }
    return newRows;
  }

  isDiscrete(field) {
    const getUnique = function(f) {
      const uniqObj = {};
      const uniqArr = [];
      let j = 0;
      for (let i = 0; i < f.length; i++) {
        const item = f[i];
        if (uniqObj[item] !== 1) {
          uniqObj[item] = 1;
          uniqArr[j++] = item;
        }
      }
      return uniqArr;
    };

    for (let i = 0; i < field.length; i++) {
      if (isNaN(parseFloat(field[i])) &&
        (typeof field[i] === 'string' || field[i] instanceof String)) {
        return true;
      }
    }

    const threshold = 0.05;
    const unique = getUnique(field);
    if (unique.length / field.length < threshold) {
      return true;
    } else {
      return false;
    }
  }

  isValidSizeOption(options) {
    const xValues = [];
    const yValues = [];
    const rows = this.tableData.rows;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const size = row[options.size.index];

      // check if the field is numeric
      if (isNaN(parseFloat(size)) || !isFinite(size)) {
        return false;
      }

      if (options.xAxis) {
        const x = row[options.xAxis.index];
        xValues[i] = x;
      }
      if (options.yAxis) {
        const y = row[options.yAxis.index];
        yValues[i] = y;
      }
    }

    // check if all existing fields are discrete
    const isAllDiscrete = options.xAxis && options.yAxis && this.isDiscrete(xValues) && this.isDiscrete(yValues) ||
    !options.xAxis && this.isDiscrete(yValues) ||
    !options.yAxis && this.isDiscrete(xValues);

    if (isAllDiscrete) {
      return false;
    }

    return true;
  }
}
