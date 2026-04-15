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

import Visualization from './visualization';
import d3 from 'd3';
import nv from 'nvd3';

/**
 * Visualize data in table format
 */
export default class Nvd3ChartVisualization extends Visualization {
  protected chart;

  constructor(targetEl, config) {
    super(targetEl, config);
    if(!this.targetEl[0].innerHTML.includes('<svg ')){
      this.targetEl.append('<svg></svg>');
    }
  }

  refresh() {
    if (this.chart && this.chart.update !== undefined) {
      this.chart.update();
    }
  }

  render(data) {

    const type = this.type();
    const d3g = data.d3g;

    if (!this.chart) {
      this.chart = nv.models[type]();
      this.configureChart(this.chart);
      if(this.chart.xAxis !== undefined && this.chart.xAxis.rotateLabels !== undefined) {
        this.chart.xAxis.rotateLabels(-45);
      }
    }

    this.chart.height(500);
    let animationDuration = 300;
    const numberOfDataThreshold = 150;
    const height = this.targetEl.height(); //maybe some defaults will be nice?

    // turn off animation when dataset is too large. (for performance issue)
    // still, since dataset is large, the chart content sequentially appears like animated

    if (d3g[0].values !== undefined && d3g[0].values.length > numberOfDataThreshold) {
      animationDuration = 0;
    }

    d3.select(`#${this.targetEl[0].id} svg`)
      .attr('height', height)
      .datum(d3g)
      .transition()
      .duration(animationDuration)
      .call(this.chart);
    d3.select(`#${this.targetEl[0].id} svg`).style('height', `${height}px`);

  }

  type():any {
    // override this and return chart type
  }

  configureChart(chart) {
    // override this to configure chart
  }

  groupedThousandsWith3DigitsFormatter(x) {
    return d3.format('.3f')(x);
  }

  customAbbrevFormatter(x) {
    const s = d3.format('.3s')(x);
    switch (s[s.length - 1]) {
      case 'G': return `${s.slice(0, -1)}B`;
    }
    return s;
  }

  defaultY() {
    return 0;
  }

  xAxisTickFormat(d, xLabels) {
    if (xLabels[d] && (isNaN(parseFloat(xLabels[d])) || !isFinite(xLabels[d]))) { // to handle string type xlabel
      return xLabels[d];
    } else {
      return d;
    }
  }

  yAxisTickFormat(d, yLabels?);
  yAxisTickFormat(d) {
    if (Math.abs(d) >= Math.pow(10, 6)) {
      return this.customAbbrevFormatter(d);
    }
    return this.groupedThousandsWith3DigitsFormatter(d);
  }

  d3DataFromPivot(
    schema,
    rows,
    keys,
    groups,
    values,
    allowTextXAxis,
    fillMissingValues,
    multiBarChart
  ) {
    const self = this;
    // construct table data
    const d3g = [];

    const concat = function(o, n) {
      if (!o) {
        return n;
      } else {
        return `${o}.${n}`;
      }
    };

    const getSchemaUnderKey = function(key, s) {
      for (const c in key.children) {
        if(Object.prototype.hasOwnProperty.call(key.children, c)) {
          s[c] = {};
          getSchemaUnderKey(key.children[c], s[c]);
        }
      }
    };

    const valueOnly = keys.length === 0 && groups.length === 0 && values.length > 0;

    const traverse = function(sKey, s, rKey, r, func, rowName, rowValue, colName) {
      if (s.type === 'key') {
        rowName = concat(rowName, sKey);
        rowValue = concat(rowValue, rKey);
      } else if (s.type === 'group') {
        colName = concat(colName, rKey);
      } else if (s.type === 'value' && sKey === rKey || valueOnly) {
        colName = concat(colName, rKey);
        func(rowName, rowValue, colName, r);
      }

      for (const c in s.children) {
        if (fillMissingValues && s.children[c].type === 'group' && r[c] === undefined) {
          const cs = {};
          getSchemaUnderKey(s.children[c], cs);
          traverse(c, s.children[c], c, cs, func, rowName, rowValue, colName);
          continue;
        }

        for (const j in r) {
          if (s.children[c].type === 'key' || c === j) {
            traverse(c, s.children[c], j, r[j], func, rowName, rowValue, colName);
          }
        }
      }
    };

    const noKey = keys.length === 0;
    const isMultiBarChart = multiBarChart;

    const sKey = Object.keys(schema)[0];

    const rowNameIndex = {};
    let rowIdx = 0;
    const colNameIndex = {};
    let colIdx = 0;
    const rowIndexValue = {};

    for (const k in rows) {
      if (Object.prototype.hasOwnProperty.call(rows, k)) {
        traverse(sKey, schema[sKey], k, rows[k], function(rowName, rowValue, colName, value) {
          if (rowNameIndex[rowValue] === undefined) {
            rowIndexValue[rowIdx] = rowValue;
            rowNameIndex[rowValue] = rowIdx++;
          }

          if (colNameIndex[colName] === undefined) {
            colNameIndex[colName] = colIdx++;
          }
          let i = colNameIndex[colName];
          if (noKey && isMultiBarChart) {
            i = 0;
          }

          if (!d3g[i]) {
            d3g[i] = {
              values: [],
              key: noKey && isMultiBarChart ? 'values' : colName,
            };
          }

          let xVar = isNaN(rowValue) ? allowTextXAxis ? rowValue : rowNameIndex[rowValue] : parseFloat(rowValue);
          let yVar = self.defaultY();
          if (xVar === undefined) {
            xVar = colName;
          }
          if (value !== undefined) {
            yVar = isNaN(value.value) ? self.defaultY() : parseFloat(value.value) / parseFloat(value.count);
          }
          d3g[i].values.push({
            x: xVar,
            y: yVar,
          });
        }, undefined, undefined, undefined);
      }
    }

    // clear aggregation name, if possible
    const namesWithoutAggr = {};
    let colName;
    let withoutAggr;
    // TODO - This part could use som refactoring - Weird if/else with similar actions and variable names
    for (colName in colNameIndex) {
      if (Object.prototype.hasOwnProperty.call(colNameIndex, colName)) {
        withoutAggr = colName.substring(0, colName.lastIndexOf('('));
        if (!namesWithoutAggr[withoutAggr]) {
          namesWithoutAggr[withoutAggr] = 1;
        } else {
          namesWithoutAggr[withoutAggr]++;
        }
      }
    }

    if (valueOnly) {
      for (let valueIndex = 0; valueIndex < d3g[0].values.length; valueIndex++) {
        colName = d3g[0].values[valueIndex].x;
        if (!colName) {
          continue;
        }

        withoutAggr = colName.substring(0, colName.lastIndexOf('('));
        if (namesWithoutAggr[withoutAggr] <= 1) {
          d3g[0].values[valueIndex].x = withoutAggr;
        }
      }
    } else {
      for (let d3gIndex = 0; d3gIndex < d3g.length; d3gIndex++) {
        colName = d3g[d3gIndex].key;
        withoutAggr = colName.substring(0, colName.lastIndexOf('('));
        if (namesWithoutAggr[withoutAggr] <= 1) {
          d3g[d3gIndex].key = withoutAggr;
        }
      }

      // use group name instead of group.value as a column name, if there're only one group and one value selected.
      if (groups.length === 1 && values.length === 1) {
        for (let d3gIndex = 0; d3gIndex < d3g.length; d3gIndex++) {
          colName = d3g[d3gIndex].key;
          colName = colName.split('.').slice(0, -1).join('.');
          d3g[d3gIndex].key = colName;
        }
      }
    }

    return {
      xLabels: rowIndexValue,
      d3g: d3g,
    };
  }

  /**
   * method will be invoked when visualization need to be destroyed.
   * Don't need to destroy this.targetEl.
   */
  destroy() {
    if (this.chart) {
      d3.selectAll(`#${this.targetEl[0].id} svg > *`).remove();
      this.chart = undefined;
    }
  }
}
