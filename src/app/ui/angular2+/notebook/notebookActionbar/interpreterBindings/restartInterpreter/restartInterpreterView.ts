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
import {Component, DOCUMENT, ElementRef, inject, input, OnDestroy, Renderer2, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as Bootstrap from 'bootstrap';

@Component({
  selector: 'restart-interpreter-view',
  template: `
    <i title="Restart" class="fa-solid fa-rotate" (click)="openDialog()"></i>
    <div class="modal" #confirmDialog tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">Restart the interpreter</h2>
            <button class="btn-close" aria-label="Close" (click)="closeDialog()"></button>
          </div>
          <div class="modal-body">
            <p>Do you want to restart this interpreter?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" (click)="restartInterpreterBinding()">Restart</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RestartInterpreterView implements OnDestroy {
  interpreterBindingId = input.required<string>();
  @ViewChild('confirmDialog') confirmDialog!: ElementRef;
  private modalInstance:Bootstrap.Modal;
  private httpClient = inject(HttpClient);
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);

  protected openDialog():void{
    this.modalInstance = new Bootstrap.Modal(this.confirmDialog.nativeElement);
    this.renderer.appendChild(this.document.body, this.confirmDialog.nativeElement);
    this.modalInstance.show();
  }

  protected closeDialog():void{
    this.modalInstance.hide();
  }

  protected restartInterpreterBinding():void{
    this.httpClient.put(`api/interpreter/setting/restart/${this.interpreterBindingId()}`, {}).subscribe();
  }

  ngOnDestroy() {
    if(this.modalInstance){
      this.modalInstance.dispose();
    }
  }
}
