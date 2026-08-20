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
import {Paragraph} from './paragraph';
import {Channel} from '../channel/channel';
import {SafeJson} from '../safeJson/safeJson';
import {SafeJsonImpl} from '../safeJson/safeJsonImpl';
import {computed, signal, Signal} from '@angular/core';
import {ComponentView} from '../rendering/componentView/componentView';
import {ResponseRegister} from '../register/responseRegister/responseRegister';
import {
  ResponseRegisterWithPropertyFilter
} from '../register/responseRegister/responseRegisterWithPropertyFilter/responseRegisterWithPropertyFilter';
import {
  ResponseRegisterWithDefaultResponseList
} from '../register/responseRegister/responseRegisterWithDefaultResponse/responseRegisterWithDefaultResponseList';
import {ResponseRegisterImpl} from '../register/responseRegister/responseRegisterImpl';
import {RequestRegister} from '../register/requestRegister/requestRegister';
import {RequestRegisterImpl} from '../register/requestRegister/requestRegisterImpl';
import {
  RequestRegisterWithPropertyDecorator
} from '../register/requestRegister/requestRegisterWithPropertyDecorator/requestRegisterWithPropertyDecorator';
import {ParagraphOutputMessageFactoryImpl} from './paragraphOutputMessageFactory/paragraphOutputMessageFactoryImpl';
import {ComponentViewImpl} from '../rendering/componentView/componentViewImpl';
import {ParagraphView} from '../../ui/angular2+/paragraph/paragraphView';
import {Output} from '../output/output';
import {OutputImpl} from '../output/outputImpl';
import {DplLog} from '../dplLog/dplLog';
import {DplLogImpl} from '../dplLog/dplLogImpl';
import {DynamicForm} from '../dynamicForm/dynamicForm';
import {DynamicFormImpl} from '../dynamicForm/dynamicFormImpl';
import {Editor} from '../editor/editor';
import {EditorImpl} from '../editor/editorImpl';

export class ParagraphImpl implements Paragraph {
  private readonly _channel: Channel;
  private readonly _output: Output;
  private readonly _dplLog: DplLog;
  private readonly _dynamicForm: DynamicForm;
  private readonly _editor: Editor;
  private readonly _paragraph: SafeJson;
  private readonly _componentView: ComponentView;
  private readonly _responseRegister:ResponseRegister;
  private readonly _requestRegister:RequestRegister;

  constructor(channel: Channel, paragraphData: object) {
    this._channel = channel;
    this._paragraph = new SafeJsonImpl(paragraphData);
    this._output = this.initializedOutput(paragraphData);
    this._dplLog = new DplLogImpl(this);
    this._dynamicForm = new DynamicFormImpl(this);
    this._editor = new EditorImpl(this, paragraphData);
    this._componentView = new ComponentViewImpl(ParagraphView, computed(() => ({
      paragraphData:paragraphData,
      requestable:this,
      editor: this._editor.print()(),
      output: this._output.print()(),
      dplLog: this._dplLog.print()(),
      dynamicForm: this._dynamicForm.print()()
    })));
    const defaultResponseList = [
      this._output,
      this._dplLog,
      this._dynamicForm,
      this._editor,
    ];
    this._responseRegister = new ResponseRegisterWithPropertyFilter(new ResponseRegisterWithDefaultResponseList(new ResponseRegisterImpl(), defaultResponseList), {name:'paragraphId', type:'string'}, this.id());
    this._requestRegister = new RequestRegisterWithPropertyDecorator(new RequestRegisterImpl(this._channel), {name:'paragraphId', value: this.id()});
  }

  private initializedOutput(paragraph: object): Output {
    const output = new OutputImpl(this);
    const paragraphOutputMessageFactory = new ParagraphOutputMessageFactoryImpl(paragraph);
    const paragraphOutputMessage = paragraphOutputMessageFactory.paragraphOutputMessage();
    if(!paragraphOutputMessage.isStub()){
      output.response(paragraphOutputMessage.print());
    }
    return output;
  }

  print(): Signal<ComponentView> {
    return signal(this._componentView);
  }

  id(): string {
    return this._paragraph.getProperty('id', 'string');
  }

  request(json: object): void {
    this._requestRegister.request(json);
  }

  response(json: object): void {
    this._responseRegister.response(json);
  }
}
