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
import {Component, computed, input} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Request} from '../../../objects/channel/request';

@Component({
  selector: 'dynamic-form',
  imports: [
    ReactiveFormsModule
  ],
  template: `
    <form [formGroup]="formGroup()" class="dynamic-form row" (submit)="submitFormRequest().request(formGroup().value)" role="form">
      <div class="d-flex align-items-center gap-3 mb-3">
      @for(formField of form(); track $index){
        <div>
          <label [for]="formField.name" class="me-2">{{formField.name}}</label>
          @if(formField.type === 'checkbox') {
            <input [id]="formField.name" [aria-label]="formField.type" [type]="formField.type" [formControlName]="formField.name" [value]="formField.value" [checked]="formField.value">
          }
          @else{
            <input [id]="formField.name" [aria-label]="formField.type" [type]="formField.type" [formControlName]="formField.name" [value]="formField.value">
          }
        </div>
        }
      </div>
      <div>
        <button type="submit">Run paragraph</button>
      </div>
    </form>
  `
})
export class DynamicFormsView {
  form = input.required<{type:string, name:string, value:unknown}[]>();
  submitFormRequest = input.required<Request>();
  formGroup = computed(() => {
    const formFields = {};
    this.form().forEach(formField => formFields[formField.name] = new FormControl(formField.value));
    return new FormGroup(formFields);
  });
}
