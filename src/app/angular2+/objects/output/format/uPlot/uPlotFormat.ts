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
import {OutputFormat} from '../outputFormat';
import {OutputSwitcherButton} from '../../switcher/button/outputSwitcherButton';
import {uPlotSwitcherButton} from './switcherButton/uPlotSwitcherButton';
import {uPlotView} from '../../../../components/output/plugins/uPlotView/uPlotView';
import {GraphType} from './graphType';
import {ContainerRef} from '../../../containerRef/containerRef';
import {uPlotPluginStub} from '../../plugins/uPlotPlugin/uPlotPluginStub';
import {SafeJsonImpl} from '../../../safeJson/safeJsonImpl';
import {uPlotPlugin} from '../../plugins/uPlotPlugin/uPlotPlugin';
import {uPlotPluginImpl} from '../../plugins/uPlotPlugin/uPlotPluginImpl';
import {OutputType} from '../../outputType';
import uPlot from 'uplot';

export class uPlotFormat implements OutputFormat {
  private readonly _switcherButtons:OutputSwitcherButton[];
  private readonly _viewComponent: new () => uPlotView;
  private readonly _containerRefs: ContainerRef[];
  private readonly _pluginStub: uPlotPlugin;
  private _plugin: uPlotPlugin;
  private readonly _outputType: string;

  constructor() {
    this._outputType = OutputType.uPlot;
    this._switcherButtons = [
      new uPlotSwitcherButton('Line Chart', 'fas fa-chart-line', GraphType.line),
      new uPlotSwitcherButton('Area Chart', 'fas fa-chart-area', GraphType.area),
      new uPlotSwitcherButton('Bar Chart', 'fas fa-chart-bar', GraphType.bar),
      new uPlotSwitcherButton('Scatter Chart', 'cf cf-scatter-chart', GraphType.scatter),
    ];
    this._viewComponent = uPlotView;
    this._containerRefs = [];
    this._pluginStub = new uPlotPluginStub();
    this._plugin = this._pluginStub;
  }

  pushContainerRef(value:ContainerRef): void {
    this._containerRefs.push(value);
    if(!this._plugin.isStub()){
      value.createComponent(this._viewComponent, [{name:'plugin', value: this._plugin}]);
    }
  }

  outputType(): string {
    return this._outputType;
  }

  render(paragraphOutputData:object): void {
    const safeParagraphOutputData = new SafeJsonImpl(paragraphOutputData);
    const outputData: uPlot.AlignedData = safeParagraphOutputData.getProperty('data', 'object');
    const outputOptions:object = safeParagraphOutputData.getProperty('options', 'object');
    this._plugin = new uPlotPluginImpl(outputData, outputOptions);
    this._containerRefs.forEach(containerRef => {
      containerRef.createComponent(this._viewComponent, [{name:'plugin', value:this._plugin}]);
    });
  }

  clear(): void {
    this._plugin = this._pluginStub;
    this._containerRefs.forEach(containerRef => containerRef.clear());
  }

  switcherButtons(): OutputSwitcherButton[] {
    return this._switcherButtons;
  }
}
