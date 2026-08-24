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
import {Component, ElementRef, input, ViewChild} from '@angular/core';
import {Requestable} from '../../../../../objects/channel/requestable';
import {RevisionCommit} from '../../../../../objects/revisionCommit/revisionCommit';
import moment from 'moment';
import {ComponentView} from '../../../../../objects/rendering/componentView/componentView';
import {NgComponentOutlet} from '@angular/common';
import {CustomDropdownDirective} from '../../../customDropdown/customDropdownDirective';
import * as Bootstrap from 'bootstrap';
import {SetNoteRevisionRequest} from '../../../../../objects/requests/setNoteRevision/setNoteRevisionRequest';

@Component({
  selector: 'revision-select',
  imports: [
    NgComponentOutlet,
    CustomDropdownDirective
  ],
  template: `
    <button customDropdown type="button" title="{{dropdownButtonText}}"
            class="btn btn-secondary dropdown-toggle" [dropdownContent]="dropdownContent">
      {{ dropdownButtonText }}
    </button>
    <ng-template #dropdownContent>
      <ul>
        @for (revisionCommit of revisionCommits(); track $index) {
          <a class="py-1 d-block" data-bs-toggle="modal" data-bs-target="#revisionModal"
             (click)="setSelectedRevision(revisionCommit)">
            <li class="dropdown-item revision">
              {{ revisionCommit.message }}
              <span class="revision-date">{{ formatDate(revisionCommit.time) }}</span>
            </li>
          </a>
        }
      </ul>
    </ng-template>
    <div class="modal fade" id="revisionModal" tabindex="-1" aria-hidden="true" #revisionDialog>
      <div class="modal-dialog modal-fullscreen modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5">View commit '{{selectedRevisionCommit.message}}'</h1>
          </div>
          @if (selectedNotebookRevision().isStub()) {
            <div class="modal-body d-flex justify-content-center align-items-center flex-column">
              <div class="spinner-border mx-2 text-primary" role="status"></div>
            </div>
          } @else {
            <div class="modal-body">
              <ng-container *ngComponentOutlet="selectedNotebookRevision().component(); inputs: selectedNotebookRevision().inputs()()"></ng-container>
            </div>
          }
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="restoreRevisionRequest()">Restore</button>
          </div>
        </div>
      </div>
    </div>
  `,
  host:{
    'class': 'btn-group',
  }
})
export class NotebookRevisionSelectView {
  requestable = input.required<Requestable>();
  revisionCommits = input.required<RevisionCommit[]>();
  selectedNotebookRevision = input.required<ComponentView>();
  protected dropdownButtonText = 'Select revision';
  protected selectedRevisionCommit:RevisionCommit = {id:'', message:'', time:0};
  @ViewChild('revisionDialog') revisionDialog: ElementRef;

  protected formatDate(time:number){
    return moment.unix(time).format('MMMM Do YYYY, h:mm:ss a');
  }

  protected setSelectedRevision(revisionCommit:RevisionCommit):void{
    this.selectedRevisionCommit = revisionCommit;
  }

  protected restoreRevisionRequest():void{
    const setNoteRevisionRequest = new SetNoteRevisionRequest(this.requestable(), this.selectedRevisionCommit.id);
    setNoteRevisionRequest.send();
    const dialog = Bootstrap.Modal.getOrCreateInstance(this.revisionDialog.nativeElement);
    dialog.hide();
  }
}
