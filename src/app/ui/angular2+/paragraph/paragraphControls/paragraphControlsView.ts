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
import {Requestable} from '../../../../objects/channel/requestable';
import {ToggleTitleView} from './toggleTitle/toggleTitleView';
import {ToggleOutputView} from './toggleOutput/toggleOutputView';
import {ToggleEditorView} from './toggleEditor/toggleEditorView';
import {CopyParagraphView} from './copyParagraph/copyParagraphView';
import {ClearParagraphOutputView} from './clearParagraphOutput/clearParagraphOutputView';
import {ToggleLineNumbersView} from './toggleLineNumbers/toggleLineNumbersView';
import {RunParagraphView} from './runParagraph/runParagraphView';
import {RunTimeStatusView} from './runTimeStatus/runTimeStatusView';
import {CancelParagraphRunView} from './cancelParagraphRun/cancelParagraphRunView';
import {ConfigDropdown} from './configDropdown/configDropdown';

@Component({
  selector: 'paragraph-controls',
  imports: [
    ToggleEditorView,
    ToggleTitleView,
    ToggleOutputView,
    CopyParagraphView,
    ClearParagraphOutputView,
    ToggleLineNumbersView,
    RunParagraphView,
    RunTimeStatusView,
    CancelParagraphRunView,
    ConfigDropdown
  ],
  template: `
    <form (submit)="$event.preventDefault()">
      <div class="control d-flex align-items-center">
        <div class="flex-fill d-flex align-items-center">
          <div class="responsive-col d-flex align-items-center">
            <fieldset [disabled]="paragraphIsRunning()">
              <toggle-editor [paragraphData]="paragraphData()" [requestable]="requestable()"></toggle-editor>
              <toggle-output [paragraphData]="paragraphData()" [requestable]="requestable()"></toggle-output>
              <copy-paragraph [paragraphData]="paragraphData()" [requestable]="requestable()"></copy-paragraph>
              <clear-paragraph-output [paragraphId]="paragraphData()['id']" [requestable]="requestable()"></clear-paragraph-output>
              <toggle-title [paragraphData]="paragraphData()" [requestable]="requestable()"></toggle-title>
              <toggle-line-numbers [paragraphData]="paragraphData()" [requestable]="requestable()"></toggle-line-numbers>
            </fieldset>
          </div>
          <div class="ms-auto d-flex align-items-center">
            <run-time-status-view [paragraphData]="paragraphData()"></run-time-status-view>
            <fieldset [disabled]="!paragraphIsRunning()">
                <cancel-paragraph-run [paragraphId]="paragraphData()['id']" [requestable]="requestable()"></cancel-paragraph-run>
            </fieldset>
            <fieldset [disabled]="paragraphIsRunning()" class="ms-auto d-flex align-items-center">
                <run-paragraph [paragraphData]="paragraphData()" [requestable]="requestable()"></run-paragraph>
                <paragraph-config-dropdown [paragraphData]="paragraphData()" [requestable]="requestable()"></paragraph-config-dropdown>
            </fieldset>
          </div>
        </div>
      </div>
    </form>

  `
})
export class ParagraphControlsView {
  requestable = input.required<Requestable>();
  paragraphData = input.required<object>();
  paragraphStatus = computed(() => this.paragraphData()['status']);
  paragraphIsRunning = computed(() => this.paragraphStatus() === 'PENDING' || this.paragraphStatus() === 'RUNNING');
}
