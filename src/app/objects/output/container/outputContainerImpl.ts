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
import {OutputContainer} from './outputContainer';
import {Channel} from '../../channel/channel';
import {Response} from '../../channel/response';
import {OutputFormat} from '../format/outputFormat';
import {OutputSwitcherImpl} from '../switcher/outputSwitcherImpl';
import {OutputSwitcher} from '../switcher/outputSwitcher';
import {TextFormat} from '../format/text/textFormat';
import {DataTablesFormat} from '../format/dataTables/dataTablesFormat';
import {uPlotFormat} from '../format/uPlot/uPlotFormat';
import {InterpreterErrorListener} from '../../interpreterErrorListener/interpreterErrorListener';
import {InterpreterErrorListenerImpl} from '../../interpreterErrorListener/interpreterErrorListenerImpl';
import {AngularFormat} from '../format/angular/angularFormat';
import {AngularObjectCollection} from '../../angularObjectCollection/angularObjectCollection';
import {HTMLFormat} from '../format/html/htmlFormat';
import {ParagraphOutputResponseImpl} from './responses/paragraphOutputResponse/paragraphOutputResponseImpl';
import {OutputPlugin} from '../plugins/outputPlugin';
import {OutputPluginStub} from '../plugins/outputPluginStub';
import {Signal, signal, WritableSignal} from '@angular/core';
import {Printable} from '../../rendering/printable/printable';

export class OutputContainerImpl implements OutputContainer{
  private readonly _channel:Channel;
  private readonly _outputFormats:OutputFormat[];
  private readonly _outputSwitcher:OutputSwitcher;
  private readonly _errorListener: InterpreterErrorListener;
  private readonly _responses: Response[];
  private readonly _outputPlugin:WritableSignal<OutputPlugin>;
  private readonly _data: WritableSignal<Map<string, Signal<OutputPlugin>>>;
  private readonly _children: WritableSignal<Printable[]>;

  constructor(channel:Channel, angularObjectCollection: AngularObjectCollection) {
    this._channel = channel;
    this._outputFormats = [
      new DataTablesFormat(this),
      new uPlotFormat(),
      new TextFormat(),
      new AngularFormat(this, angularObjectCollection),
      new HTMLFormat()
    ];
    this._outputSwitcher = new OutputSwitcherImpl(this);
    this._errorListener = new InterpreterErrorListenerImpl(this);
    this._outputPlugin = signal(new OutputPluginStub());
    this._data = signal(new Map());
    this._data().set('plugin', this._outputPlugin);
    this._children = signal([]);
    this._responses = [
      new ParagraphOutputResponseImpl(this, this._outputFormats, this._outputSwitcher, this._outputPlugin)
    ];
  }

  errorListener(): InterpreterErrorListener {
    return this._errorListener;
  }

  outputSwitcher(): OutputSwitcher {
    return this._outputSwitcher;
  }

  outputFormats(): OutputFormat[] {
    return this._outputFormats;
  }

  request(data: object): void {
    this._channel.request(data);
  }

  response(data: object): void {
    this._responses.forEach(response => response.response(data));
    this._errorListener.response(data);
  }

  render(): {
    type: string
    data: WritableSignal<Map<string, Signal<OutputPlugin>>>
    children: Signal<Printable[]>
  } {
    return {
      type: 'CONTAINER',
      children: this._children,
      data: this._data,
    };
  }
}
