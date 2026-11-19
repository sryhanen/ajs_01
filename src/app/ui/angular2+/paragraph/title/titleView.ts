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
import {Component, ElementRef, input, model, ModelSignal, OnDestroy, ViewChild} from '@angular/core';
import {Modal} from 'bootstrap';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'editable-title',
  imports: [
    FormsModule
  ],
  template: `
    <div class="d-flex align-items-center">
      <h3 class="paragraph-title">
        {{ titleText() !== '' ? titleText() : 'Untitled' }}
      </h3>
      <button class="btn btn-link-secondary btn-sm ms-2" (click)="openEditTitleView()">
        <i class="fa-solid fa-pen-to-square"
           title="Edit title">
        </i>
      </button>
    </div>
    <div #editTitleView class="modal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Rename paragraph</h5>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-auto">
                <label class="col-form-label">Paragraph name</label>
              </div>
              <div class="col">
                <input class="form-control" placeholder="Untitled" [(ngModel)]="titleModel">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="closeEditTitleView()">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="saveTitle()">Save</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TitleView implements OnDestroy {
  titleText = input.required<string>();
  updateTitleCallback = input.required<(title:string) => void>();

  @ViewChild('editTitleView') editTitleView!: ElementRef<HTMLDivElement>;
  titleModel:ModelSignal<string> = model('');

  openEditTitleView(): void {
    const modal = Modal.getOrCreateInstance(this.editTitleView.nativeElement, {
      backdrop: 'static',
    });
    this.titleModel.set(this.titleText());
    modal.show();
  }

  closeEditTitleView(): void {
    Modal.getInstance(this.editTitleView.nativeElement)?.hide();
  }

  saveTitle():void{
    this.updateTitleCallback()(this.titleModel());
    Modal.getInstance(this.editTitleView.nativeElement)?.hide();
  }

  ngOnDestroy():void {
    Modal.getInstance(this.editTitleView?.nativeElement)?.dispose();
  }
}
