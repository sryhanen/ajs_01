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
import {AfterViewInit, Component, input, model, output, signal} from '@angular/core';
import {FormControl, FormsModule,ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'editable-text',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    @if (!isEditing()) {
      <span (click)="startEditing()" [class]="textClassName()">
       {{ text() }}
     </span>
    } @else {
      @let textValueIsInvalid = required()&&textValueControl.invalid;
      <div class="input-group flex-nowrap position-relative">
        <input class="me-2" type="text" [formControl]="textValueControl" [required]="required()"/>
        <button class="bg-transparent border-0 p-0 me-2" (click)="commitTextChange()" type="submit"
                aria-label="Save changes" [disabled]="textValueIsInvalid">
          <i class="fas fa-check fa-lg" [class]="textValueIsInvalid ? 'overwrite-note-action':''"></i>
        </button>
        <button class="bg-transparent border-0 p-0" (click)="cancelChanges()" type="reset"
                aria-label="Revert changes">
          <i class="fas fa-times fa-lg"></i>
        </button>
        @if (textValueIsInvalid) {
          <div class="absolute-validation-text">
            Value is required.
          </div>
        }
      </div>
    }
  `,
  styles:`
    .absolute-validation-text {
      position: absolute;
      top: 100%;
      left: 0;
      color: #dc3545;
      font-size: 0.875em;
    }
    .overwrite-note-action {
      color: var(--primary-300) !important;
      cursor: default !important;
    }
  `
})
export class EditableTextView implements AfterViewInit {
  text = model.required<string>();
  required = input<boolean>(false);
  textClassName = input<string>();
  newText = output<string>();
  textValueControl:FormControl<string>;

  ngAfterViewInit() {
    this.textValueControl = new FormControl(this.text(), [
      Validators.required,
      Validators.pattern(/.*\S.*/)
    ]);
  }

  protected originalText:string;
  protected isEditing = signal(false);

  protected commitTextChange(): void {
    this.newText.emit(this.textValueControl.value);
    this.text.set(this.textValueControl.value);
    this.stopEditing();
  }

  protected startEditing(): void  {
    this.originalText = this.text();
    this.isEditing.set(true);
  }

  protected stopEditing(): void {
    this.isEditing.set(false);
  }

  protected cancelChanges(): void {
    this.textValueControl.reset(this.originalText);
    this.stopEditing();
  }
}
