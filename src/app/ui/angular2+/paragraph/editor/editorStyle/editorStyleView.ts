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
import {Component, input} from '@angular/core';
import {EditorStyle} from '../../../../../objects/paragraph/editor/editorStyle/editorStyle';

@Component({
  selector:'editor-style',
  template:`
    <ul class="dropdown-menu">
      <li class="px-2 py-2 d-flex align-items-center justify-content-between">
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" [checked]="displayLineNumbers()" (change)="updateLineNumberVisibility($event)">
            <label class="form-check-label">Toggle line numbers</label>
        </div>
      </li>
      <li class="px-2 py-2 d-flex align-items-center justify-content-between">
        <label>Font size</label>
        <select class="form-select form-select-sm w-auto" aria-label="Select font size" (change)="updateFontSize($event)">
          @for(fontSizeOption of fontSizeOptions(); track $index){
            @if(fontSizeOption === currentFontSize()){
              <option [value]="fontSizeOption" selected>{{fontSizeOption}}</option>
            }
            @else{
              <option [value]="fontSizeOption">{{fontSizeOption}}</option>
            }
          }
        </select>
      </li>
    </ul>
    <button class="btn btn-sm" data-bs-toggle="dropdown">
      <i class="fa-solid fa-gear"></i>
    </button>
  `
})
export class EditorStyleView {
  fontSizeOptions = input.required<number[]>();
  currentFontSize = input.required<number>();
  displayLineNumbers = input.required<boolean>();
  editorStyle = input.required<EditorStyle>();

  updateFontSize(event: Event):void{
    const value = (event.target as HTMLSelectElement).value;
    this.editorStyle().updateFontSize(Number(value));
  }

  updateLineNumberVisibility(event: Event):void{
    const value = (event.target as HTMLInputElement).checked;
    this.editorStyle().updateLineNumberVisibility(Boolean(value));
  }
}
