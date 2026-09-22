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
import {uPlotSwitcherButton} from './switcherButton/uPlotSwitcherButton';
import {GraphType} from './graphType';
import {WebSocketPayloadImpl} from '../../../safeJson/webSocketPayloadImpl';
import {computed, signal, Signal, WritableSignal} from '@angular/core';
import {RenderNode} from '../../../rendering/renderNode/renderNode';
import {Channel} from '../../../channel/channel';
import {Printable} from '../../../rendering/printable/printable';
import {UPlotFormat} from './uPlotFormat';
import {BasicOptionsImpl} from './uPlotPlugin/configuration/options/basicOptionsImpl';
import {RegisteredComponents} from '../../../../ui/angular2+/componentRegistry/registeredComponents';
import {RenderNodeImpl} from '../../../rendering/renderNode/renderNodeImpl';
import uPlot from 'uplot';
import {OutputPayload} from '../../outputPayload';
import {BasicOptions} from './uPlotPlugin/configuration/options/basicOptions';

export class UPlotFormatImpl implements UPlotFormat {
  private readonly _channel: Channel;
  private readonly _switcherButtons: Printable[];
  private readonly _renderNode: WritableSignal<RenderNode>;
  private readonly _graphType: WritableSignal<string>;
  private readonly _uPlotOptions: WritableSignal<BasicOptions>;
  private readonly _uPlotOutputData:WritableSignal<uPlot.AlignedData>;

  constructor(channel: Channel) {
    this._channel = channel;
    this._switcherButtons = [
      new uPlotSwitcherButton(this,'Line Chart', 'fas fa-chart-line', GraphType.line),
      new uPlotSwitcherButton(this,'Area Chart', 'fas fa-chart-area', GraphType.area),
      new uPlotSwitcherButton(this,'Bar Chart', 'fas fa-chart-bar', GraphType.bar),
      new uPlotSwitcherButton(this,'Scatter Chart', 'cf cf-scatter-chart', GraphType.scatter),
    ];
    this._graphType = signal('');
    this._uPlotOptions = signal(new BasicOptionsImpl([],[],'',''));
    this._uPlotOutputData = signal([]);
    this._renderNode = signal(new RenderNodeImpl(RegisteredComponents.UPLOT_OUTPUT_VIEW, computed(() => ({
      graphType: this._graphType(),
      basicOptions: this._uPlotOptions(),
      uPlotData: this._uPlotOutputData(),
    }))));
  }

  render(data: Pick<OutputPayload<uPlot.AlignedData>, 'data' | 'options'>): void {
    const safeOutputOptions = new WebSocketPayloadImpl(data.options);
    const labels = safeOutputOptions.arrayProperty<string>('labels');
    const series = safeOutputOptions.arrayProperty<string>('series');
    const xAxisLabel = safeOutputOptions.stringProperty('xAxisLabel');
    const graphType = safeOutputOptions.stringProperty('graphType');
    const basicOptions = new BasicOptionsImpl(labels, series, xAxisLabel, graphType);
    const uPlotOutputData = data.data;
    this._graphType.set(graphType);
    this._uPlotOptions.set(basicOptions);
    this._uPlotOutputData.set(uPlotOutputData);
  }

  request(json: object): void {
    this._channel.request(json);
  }

  print(): Signal<RenderNode> {
    return this._renderNode;
  }

  switcherButtons(): RenderNode[] {
    return this._switcherButtons.map(switcherButton => switcherButton.print()());
  }
}
