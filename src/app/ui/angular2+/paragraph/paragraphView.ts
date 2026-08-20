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
import {ComponentView} from '../../../objects/rendering/componentView/componentView';
import {NgComponentOutlet} from '@angular/common';
import {ParagraphControlsView} from './paragraphControls/paragraphControlsView';
import {Requestable} from '../../../objects/channel/requestable';
import {ParagraphProgressBar} from './progressBar/paragraphProgressBar';

@Component({
  selector: 'paragraph',
  imports: [
    NgComponentOutlet,
    ParagraphControlsView,
    ParagraphProgressBar
  ],
  template: `
    <div class="paragraph paragraph-box paragraph-col" [class]="paragraphWidthClass()">
        <paragraph-controls [paragraphData]="paragraphData()" [requestable]="requestable()"></paragraph-controls>
        <ng-container *ngComponentOutlet="editor().component(); inputs: editor().inputs()()"></ng-container>
        <paragraph-progress-bar [paragraphData]="paragraphData()"></paragraph-progress-bar>
        <ng-container *ngComponentOutlet="output().component(); inputs: output().inputs()()"></ng-container>
        @if(!dynamicForm().isStub()){
          <ng-container *ngComponentOutlet="dynamicForm().component(); inputs: dynamicForm().inputs()()"></ng-container>
        }
        @if(!dplLog().isStub()){
          <ng-container *ngComponentOutlet="dplLog().component(); inputs: dplLog().inputs()()"></ng-container>
        }
    </div>
  `
})
export class ParagraphView{
  paragraphData = input.required<object>();
  requestable = input.required<Requestable>();
  editor = input.required<ComponentView>();
  output = input.required<ComponentView>();
  dynamicForm = input.required<ComponentView>();
  dplLog = input.required<ComponentView>();
  paragraphWidthClass = computed(() => `col-md-${this.paragraphData()['config']['colWidth']}`);
}
