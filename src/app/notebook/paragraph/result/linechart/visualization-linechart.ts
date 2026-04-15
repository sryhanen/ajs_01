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
import moment from 'moment';
import d3 from 'd3';

/**
 * Visualize data in line chart
 */
export default class LinechartVisualization extends Nvd3ChartVisualization {
  private xLabels;
  private currentMode;

  constructor(targetEl, config) {
    super(targetEl, config);
    try {
      this.config.rotate = {degree: config.rotate.degree};
    } catch (e) {
      console.warn(`Failed to set rotate value: ${e}. Defaulting to -45 degrees.`);
      this.config.rotate = {degree: '-45'};
    }
  }

  type() {
    if (this.config.lineWithFocus) {
      return 'lineWithFocusChart';
    } else {
      return 'lineChart';
    }
  }

  render(pivot) {
    const d3Data = this.d3DataFromPivot(
      pivot.schema,
      pivot.rows,
      pivot.keys,
      pivot.groups,
      pivot.values,
      false,
      true,
      false);

    this.xLabels = d3Data.xLabels;
    super.render(d3Data);
    this.config.changeXLabel(this.config.xLabelStatus);
  }

  /**
   * Set new config
   */
  setConfig(config) {
    super.setConfig(config);

    // change mode
    if (this.currentMode !== config.lineWithFocus) {
      super.destroy();
      this.currentMode = config.lineWithFocus;
    }
  }

  configureChart(chart) {
    const self = this;
    const configObj = self.config;

    chart.xAxis.tickFormat(function(d) {
      if (self.config.isDateFormat) {
        if (self.config.dateFormat) {
          return moment(new Date(self.xAxisTickFormat(d, self.xLabels))).format(self.config.dateFormat);
        } else {
          return moment(new Date(self.xAxisTickFormat(d, self.xLabels))).format('YYYY-MM-DD HH:mm:ss');
        }
      }
      return self.xAxisTickFormat(d, self.xLabels);
    });
    chart.yAxis.tickFormat(function(d) {
      if (d === undefined) {
        return 'N/A';
      }
      return self.yAxisTickFormat(d);
    });
    chart.yAxis.axisLabelDistance(50);
    if (chart.useInteractiveGuideline) {   // lineWithFocusChart hasn't got useInteractiveGuideline
      chart.useInteractiveGuideline(true); // for better UX and performance issue. (https://github.com/novus/nvd3/issues/691)
    }
    if (this.config.forceY) {
      chart.forceY([0]); // force y-axis minimum to 0 for line chart.
    } else {
      chart.forceY([]);
    }

    self.config.changeXLabel = function(type) {
      switch (type) {
        case 'default':
          self.chart._options['showXAxis'] = true;
          self.chart._options['margin'] = {bottom: 50};
          self.chart.xAxis.rotateLabels(-45);
          configObj.xLabelStatus = 'default';
          break;
        case 'rotate':
          self.chart._options['showXAxis'] = true;
          self.chart._options['margin'] = {bottom: 140};
          self.chart.xAxis.rotateLabels(configObj.rotate.degree);
          configObj.xLabelStatus = 'rotate';
          break;
        case 'hide':
          self.chart._options['showXAxis'] = false;
          self.chart._options['margin'] = {bottom: 50};
          d3.select(`#${self.targetEl[0].id}> svg`).select('g.nv-axis.nv-x').selectAll('*').remove();
          configObj.xLabelStatus = 'hide';
          break;
      }
      self.emitConfig(configObj);
    };

    self.config.isXLabelStatus = function(type) {
      if (configObj.xLabelStatus === type) {
        return true;
      } else {
        return false;
      }
    };

    self.config.setDegree = function(type) {
      configObj.rotate.degree = type;
      self.chart.xAxis.rotateLabels(type);
      self.emitConfig(configObj);
    };

    self.config.setDateFormat = function(format) {
      configObj.dateFormat = format;
      self.emitConfig(configObj);
    };
  }

  defaultY() {
    return undefined;
  }
}
