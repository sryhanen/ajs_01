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
import {Component, computed, ElementRef, input, model, ViewChild} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
import * as bootstrap from 'bootstrap';
import {ParagraphTitle} from '../../../../objects/paragraph/paragraphTitle/paragraphTitle';

@Component({
  selector: 'paragraph-title',
  imports: [
    FormsModule
  ],
  template: `
    <div class="d-flex align-items-center gap-3">
      <h3 class="text-uppercase mb-0">
        {{titleText()}}
      </h3>
      <button class="bg-transparent border-0 p-0" (click)="openEditModal()">
        <i class="fa-solid fa-pen-to-square" title="Edit paragraph title" aria-label="Edit paragraph title"></i>
      </button>
    </div>

    <div #editModal class="modal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-uppercase">Rename Paragraph</h5>
          </div>
          <div class="modal-body">
            <div  class="d-flex align-items-center gap-4">
              <label>Paragraph title</label>
              <input class="me-2 mb-2" type="text" [(ngModel)]="paragraphTitleModel" #titleModel="ngModel">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="cancelEditing(titleModel)" type="reset">Cancel</button>
            <button class="btn btn-primary" (click)="commitParagraphTitle()" type="submit">Save</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ParagraphTitleView {
  paragraphTitle = input.required<ParagraphTitle>();
  paragraphTitleValue = computed(() => this.paragraphTitle().asSignal()());
  titleText = computed(() => this.paragraphTitleValue() !== '' ? this.paragraphTitleValue() : 'Untitled');
  paragraphTitleModel = model('');
  @ViewChild('editModal') modalElement!: ElementRef;
  private modalInstance!: bootstrap.Modal;

  openEditModal() {
    if (!this.modalInstance) {
      this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
    }
    this.modalInstance.show();
    this.paragraphTitleModel.set(this.paragraphTitleValue());
  }

  cancelEditing(model: NgModel):void{
    model.reset(this.paragraphTitleValue());
    this.closeEditModal();
  }

  commitParagraphTitle():void{
    this.paragraphTitle().update(this.paragraphTitleModel());
    this.closeEditModal();
  }

  private closeEditModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }
}
