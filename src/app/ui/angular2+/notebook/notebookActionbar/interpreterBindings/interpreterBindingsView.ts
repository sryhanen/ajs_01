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
import {Component, inject, input} from '@angular/core';
import {InterpreterBinding} from '../../../../../objects/notebook/notebookActionbar/interpreterBindings/interpreterBinding/interpreterBinding';
import {CustomDropdownDirective} from '../../../customDropdown/customDropdownDirective';
import {Requestable} from '../../../../../objects/channel/requestable';
import {
  SaveInterpreterBindingsRequest
} from '../../../../../objects/requests/saveInterpreterBindings/saveInterpreterBindingsRequest';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'interpreter-bindings',
  imports: [
    CustomDropdownDirective
  ],
  template: `
    <button class="btn btn-secondary dropdown-toggle"
            type="button"
            title="Interpreter restart"
            customDropdown [dropdownContent]="dropdownContent">
      <i class="fas fa-rotate"></i>
      Restart interpreter
    </button>
    <ng-template #dropdownContent>
      <div class="mr-2">
        <h2 class="dropdown-header mt-0">
          Interpreter restart
        </h2>
        @for (interpreterBinding of interpreterBindings(); track $index) {
          <hr/>
          <div class="d-flex mb-2">
            <div class="w-75">
              {{ interpreterBinding.name }}
              @if (interpreterBinding.selected) {
                (default)
              }
              <small class="text-muted">
                @for (interpreter of interpreterBinding.interpreters; track $index) {
                  {{ interpreter.name }}
                }
              </small>
            </div>
            <div class="ms-auto">
              <i title="Make this interpreter the default"
                 class="fa-solid me-2"
                 [class]="interpreterBinding.selected ? 'fa-circle-dot': 'fa-circle'"
                 (click)="setSelectedInterpreterBinding(interpreterBinding)">
              </i>
              <i title="Restart" class="fa-solid fa-rotate" (click)="restartInterpreterBinding(interpreterBinding)"></i>
            </div>
          </div>
        }
      </div>
    </ng-template>
  `
})
export class InterpreterBindingsView {
  interpreterBindings = input.required<InterpreterBinding[]>();
  requestable = input.required<Requestable>();
  private httpClient = inject(HttpClient);

  protected setSelectedInterpreterBinding(interpreterBinding:InterpreterBinding):void{
    const saveInterpreterBindingsRequest = new SaveInterpreterBindingsRequest(this.requestable(), interpreterBinding.id);
    saveInterpreterBindingsRequest.send();
  }

  protected restartInterpreterBinding(interpreterBinding:InterpreterBinding):void{
    this.httpClient.put(`/interpreter/setting/restart/${interpreterBinding.id}`, {}).subscribe();
  }
}
