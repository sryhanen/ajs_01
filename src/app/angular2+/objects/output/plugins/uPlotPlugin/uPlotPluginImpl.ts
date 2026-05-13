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
import {uPlotOutputOptions} from './uPlotOutputOptions';
import uPlot from 'uplot';
import {ResizeListener} from './configuration/resizeListener/resizeListener';
import {ResizeListenerImpl} from './configuration/resizeListener/resizeListenerImpl';
import {GraphType} from '../../format/uPlot/graphType';
import {BarChartOptionsImpl} from './configuration/options/barChartOptionsImpl';
import {BasicOptionsImpl} from './configuration/options/basicOptionsImpl';
import {SafeJsonImpl} from '../../../safeJson/safeJsonImpl';
import {OutputPlugin} from '../outputPlugin';
import {OutputType} from '../../outputType';

export class uPlotPluginImpl implements OutputPlugin {
  private readonly _outputData: uPlot.AlignedData;
  private readonly _outputOptions:object;
  private readonly _outputType:string;

  constructor(outputData: uPlot.AlignedData, outputOptions:object) {
    this._outputType = OutputType.uPlot;
    this._outputData = outputData;
    this._outputOptions = outputOptions;
  }

  outputType(): string {
    return this._outputType;
  }

  response(data: object): void {
      throw new Error("Method not implemented.");
  }

  render(anchorElement: HTMLElement): void {
    const safeOutputOptions = new SafeJsonImpl(this._outputOptions);
    const uPlotOutputOptions: uPlotOutputOptions = {
      labels:safeOutputOptions.getProperty('labels', 'object'),
      series:safeOutputOptions.getProperty('series', 'object'),
      xAxisLabel:safeOutputOptions.getProperty('xAxisLabel', 'string'),
      graphType: safeOutputOptions.getProperty('graphType', 'string'),
    };
    let uPlotOptions:uPlot.Options;
    const basicOptions = new BasicOptionsImpl(uPlotOutputOptions);
    if(uPlotOutputOptions.graphType === GraphType.bar){
      const barChartOptions = new BarChartOptionsImpl(basicOptions);
      uPlotOptions = barChartOptions.options();
    }
    else{
      uPlotOptions = basicOptions.options();
    }
    const size:ResizeListener = new ResizeListenerImpl();
    const graph = new uPlot(uPlotOptions, this._outputData, anchorElement);
    size.registerToWindow(graph);
    size.registerToElement(graph, anchorElement);
  }

  isStub(): boolean {
    return false;
  }
}
