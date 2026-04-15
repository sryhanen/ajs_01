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
import d3 from 'd3';

/**
 * Visualize data in area chart
 */
export default class AreachartVisualization extends Nvd3ChartVisualization {
  private xLabels;

  constructor(targetEl, config) {
    super(targetEl, config);

    try {
      this.config.rotate = {degree: config.rotate.degree};
    } catch (e) {
      console.warn(`Failed to set rotate value: ${e.message}. Defaulting to -45 degrees.`);
      this.config.rotate = {degree: '-45'};
    }
  }

  type() {
    return 'stackedAreaChart';
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
  }

  configureChart(chart) {
    const self = this;
    const configObj = self.config;

    chart.xAxis.tickFormat(function(d) {
      return self.xAxisTickFormat(d, self.xLabels);
    });
    chart.yAxis.tickFormat(function(d) {
      return self.yAxisTickFormat(d);
    });
    chart.yAxis.axisLabelDistance(50);
    chart.useInteractiveGuideline(true);
    // for better UX and performance issue. (https://github.com/novus/nvd3/issues/691)

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

    self.config.isDegreeEmpty = function() {
      if (configObj.rotate.degree.length > 0) {
        return true;
      } else {
        configObj.rotate.degree = '-45';
        self.emitConfig(configObj);
        return false;
      }
    };

    this.chart.style(this.config.style || 'stack');

    this.chart.dispatch.on('stateChange', function(s) {
      self.config.style = s.style;

      // give some time to animation finish
      setTimeout(function() {
        self.emitConfig(self.config);
      }, 500);
    });
  }
}
