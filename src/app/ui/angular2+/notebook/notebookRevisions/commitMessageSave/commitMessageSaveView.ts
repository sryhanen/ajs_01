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
import {Component, ElementRef, input, model, ViewChild} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
import {CheckpointNoteRequest} from '../../../../../objects/requests/checkpointNote/checkpointNoteRequest';
import {Requestable} from '../../../../../objects/channel/requestable';
import {CustomDropdownDirective} from '../../../customDropdown/customDropdownDirective';

@Component({
  selector: 'commit-message-save',
  imports: [
    FormsModule,
    CustomDropdownDirective
  ],
  template: `
    <button class="btn btn-secondary dropdown-toggle" customDropdown="content"  #dropdown="customDropdown" [dropdownContent]="dropdownContent">
      <i class="fas fa-floppy-disk"></i>
    </button>
    <ng-template #dropdownContent>
      <div class="commit-container">
        <div class="input-group input-group-sm">
          <input #commitMessageInput
                 type="text"
                 class="form-control"
                 placeholder="Name the save"
                 aria-label="Commit message input"
                 [(ngModel)]="commitMessageValue"
                 required
                 pattern=".*\\S.*"
                 #commitMessage="ngModel"
                 autofocus
          />
          <button class="btn btn-secondary" type="button" (click)="checkpointNoteRequest(dropdown);"
                  aria-label="Save commit message">
            Save
          </button>
        </div>
        @if (commitMessage.invalid && (commitMessage.dirty)) {
          @if (commitMessage.hasError('required') || commitMessageValue().trim().length === 0) {
            <div class="mt-3 alert alert-warning">Name is required</div>
          }
        }
      </div>
    </ng-template>
  `,
  host:{
    'class': 'btn-group',
  }
})
export class CommitMessageSaveView {
  @ViewChild('commitMessageInput') commitMessageInput: ElementRef;
  @ViewChild('commitMessage') commitMessageForm:NgModel;

  requestable = input.required<Requestable>();
  protected commitMessageValue = model('');

  protected checkpointNoteRequest(dropdown: CustomDropdownDirective): void {
    if(this.commitMessageForm.valid){
      const checkpointNoteRequest = new CheckpointNoteRequest(this.requestable(), this.commitMessageValue().trim());
      checkpointNoteRequest.send();
      dropdown.close();
      this.commitMessageValue.set('');
    }
  }
}
