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
import {InterpreterBindings} from './interpreterBindings';
import {computed, signal, Signal, WritableSignal} from '@angular/core';
import {ComponentView} from '../../../rendering/componentView/componentView';
import {ResponseRegister} from '../../../register/responseRegister/responseRegister';
import {Channel} from '../../../channel/channel';
import {ResponseRegisterImpl} from '../../../register/responseRegister/responseRegisterImpl';
import {InterpreterBinding} from './interpreterBinding/interpreterBinding';
import {InterpreterBindingsMessageImpl} from '../../../message/interpreterBindings/interpreterBindingsMessageImpl';
import {MessageImpl} from '../../../message/messageImpl';
import {SafeJsonImpl} from '../../../safeJson/safeJsonImpl';
import {ComponentViewImpl} from '../../../rendering/componentView/componentViewImpl';
import {InterpreterBindingsView} from '../../../../ui/angular2+/notebook/notebookActionbar/interpreterBindings/interpreterBindingsView';

export class InterpreterBindingsImpl implements InterpreterBindings {
  private readonly _channel:Channel;
  private readonly _responseRegister:ResponseRegister;
  private readonly _interpreterBindings:WritableSignal<InterpreterBinding[]>;
  private readonly _componentView:Signal<ComponentView>;

  constructor(channel:Channel) {
    this._channel = channel;
    this._responseRegister = new ResponseRegisterImpl();
    this._responseRegister.register('INTERPRETER_BINDINGS', (json) => this.interpreterBindingsResponse(json));
    this._interpreterBindings = signal([]);
    this._componentView = signal(new ComponentViewImpl(InterpreterBindingsView, computed(() => ({
      interpreterBindings:this._interpreterBindings(),
    }))));
  }

  print(): Signal<ComponentView> {
    return this._componentView;
  }

  request(json: object): void {
    this._channel.request(json);
  }

  response(json: object): void {
    this._responseRegister.response(json);
  }

  private interpreterBindingsResponse(json:object):void{
    const interpreterBindingsMessage = new InterpreterBindingsMessageImpl(new MessageImpl(new SafeJsonImpl(json)));
    this._interpreterBindings.set(interpreterBindingsMessage.interpreterBindings());
  }
}
