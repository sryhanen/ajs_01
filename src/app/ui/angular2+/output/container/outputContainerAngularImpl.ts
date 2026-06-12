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
import {OutputPlugin} from '../../../../objects/output/plugins/outputPlugin';
import {OutputContainer} from '../../../../objects/output/container/outputContainer';
import { InterpreterErrorListener } from '../../../../objects/interpreterErrorListener/interpreterErrorListener';
import { OutputFormat } from '../../../../objects/output/format/outputFormat';
import { OutputSwitcher } from '../../../../objects/output/switcher/outputSwitcher';
import {signal, WritableSignal} from '@angular/core';
import {OutputSwitcherAngularImpl} from '../switcher/outputSwitcherAngularImpl';

export class OutputContainerAngularImpl implements OutputContainer {
  private readonly _outputContainer: OutputContainer;
  private readonly _outputPlugin: WritableSignal<OutputPlugin>;
  private readonly _outputSwitcher: OutputSwitcher;

  constructor(outputContainer: OutputContainer) {
    this._outputContainer = outputContainer;
    this._outputPlugin = signal(this._outputContainer.outputPlugin());
    this._outputSwitcher = new OutputSwitcherAngularImpl(this._outputContainer.outputSwitcher());
  }

  outputSwitcher(): OutputSwitcher {
    return this._outputSwitcher;
  }

  outputFormats(): OutputFormat[] {
    return this._outputContainer.outputFormats();
  }

  errorListener(): InterpreterErrorListener {
    return this._outputContainer.errorListener();
  }

  request(data: object): void {
    this._outputContainer.request(data);
  }

  response(data: object): void {
    this._outputPlugin.set(this._outputContainer.outputPlugin());
    this._outputSwitcher.response(data);
  }

  outputPlugin(): OutputPlugin{
    return this._outputPlugin();
  }
}
