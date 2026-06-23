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
import {OutputSwitcher} from './outputSwitcher';
import {SafeJsonImpl} from '../../safeJson/safeJsonImpl';
import {MessageImpl} from '../../message/messageImpl';
import {computed, signal, Signal, WritableSignal} from '@angular/core';
import { RenderNode } from '../../rendering/renderNode/renderNode';
import {Printable} from '../../rendering/printable/printable';
import {ComponentViewImpl} from '../../rendering/componentView/componentViewImpl';
import {OutputSwitcherView} from '../../../ui/angular2+/output/switcher/outputSwitcherView';

export class OutputSwitcherImpl implements OutputSwitcher {
  private readonly _isSwitchable:WritableSignal<boolean>;
  private readonly _isLoading:WritableSignal<boolean>;
  private readonly _switcherButtons: Printable[];

  constructor(switcherButtons: Printable[]) {
    this._switcherButtons = switcherButtons;
    this._isSwitchable = signal(true);
    this._isLoading = signal(false);
  }

  print(): Signal<RenderNode> {
    return computed(() => ({
      children:computed(() => []),
      componentView: new ComponentViewImpl(OutputSwitcherView, computed(() => ({
        switcherButtons: this._switcherButtons,
        switchIsPending: this._isLoading(),
        outputIsSwitchable: this._isSwitchable(),
      })))
    }));
  }

  response(data: object): void {
    const message = new MessageImpl(new SafeJsonImpl(data));
    if(message.operation() === 'PARAGRAPH_OUTPUT'){
      const paragraphOutputData = new SafeJsonImpl(message.data());
      const safeOutput = new SafeJsonImpl(paragraphOutputData.getProperty('output', 'object'));
      if(safeOutput.propertyExists('isAggregated')){
        this._isSwitchable.set(safeOutput.getProperty('isAggregated', 'boolean'));
      }
      else{
        this._isSwitchable.set(false);
      }
      this._isLoading.set(false);
    }
  }
}
