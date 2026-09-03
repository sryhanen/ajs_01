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
import {ComponentView} from '../../../../objects/rendering/componentView/componentView';
import {NgComponentOutlet} from '@angular/common';
import {NotebookTitleView} from './notebookTitle/notebookTitleView';
import {Requestable} from '../../../../objects/channel/requestable';
import {RunAllParagraphsButton} from './runAllParagraphs/runAllParagraphsButton';
import {ClearOutputsButton} from './clearOutputs/clearOutputsButton';
import {CloneNotebookButton} from './cloneNotebook/cloneNotebookButton';
import {ExportNotebookButton} from './exportNotebook/exportNotebookButton';
import {JobSchedulerView} from './jobScheduler/jobSchedulerView';

@Component({
  selector: 'notebook-actionbar',
  imports: [
    NgComponentOutlet,
    NotebookTitleView,
    RunAllParagraphsButton,
    ClearOutputsButton,
    CloneNotebookButton,
    ExportNotebookButton,
    JobSchedulerView
  ],
  template: `
    <div class="note-action">
      <nav class="navbar navbar-expand-xl note-action-container collapse show" id="noteActionCollapse">
        <div class="container-fluid px-5">
          <notebook-title class="me-3" [requestable]="requestable()" [title]="notebookTitle()"></notebook-title>
          <div class="btn-group me-2" role="group" aria-label="button group">
            <run-all-paragraphs-button class="btn-group" [requestable]="requestable()"></run-all-paragraphs-button>
            <clear-outputs-button class="btn-group" [requestable]="requestable()"></clear-outputs-button>
            <clone-notebook-button class="btn-group"></clone-notebook-button>
            <export-notebook-button class="btn-group"></export-notebook-button>
          </div>
          <div class="container-fluid px-5">
            <ng-container *ngComponentOutlet="notebookRevisions().component(); inputs: notebookRevisions().inputs()()"></ng-container>
            <job-scheduler></job-scheduler>
          </div>
        </div>
      </nav>
      <div class="collapse-button container-fluid px-5 position-relative text-end">
        <button class="btn btn-collapse"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#noteActionCollapse"
                aria-expanded="true">
        </button>
      </div>
    </div>
  `
})
export class NotebookActionbarView {
  requestable = input.required<Requestable>();
  notebookTitle = input.required<string>();
  notebookRevisions = input.required<ComponentView>();
}
