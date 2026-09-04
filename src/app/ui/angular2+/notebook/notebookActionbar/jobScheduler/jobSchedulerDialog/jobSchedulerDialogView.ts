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
import {
  AbstractControl,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import parser from 'cron-parser';
import {Requestable} from '../../../../../../objects/channel/requestable';
import {NoteUpdateRequest} from '../../../../../../objects/requests/noteUpdate/noteUpdateRequest';

@Component({
  selector: 'job-scheduler-dialog-content',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="cron-preset-container px-4 py-2">
      <div class="mb-3">
        <div class="row">
          <div class="input-group">
            <input type="text"
                   class="form-control form-control-sm"
                   placeholder="Write a cron expression"
                   [formControl]="cronInputFormControl()"/>
            <button class="btn btn-sm btn-secondary" type="button" [disabled]="cronInputFormControl().invalid" (click)="setJobSchedule()">
              Set
            </button>
          </div>
        </div>
        @if(cronInputFormControl().hasError('cronError')){
          <div class="mt-3 alert alert-warning">
            {{cronInputFormControl().getError('cronError')}}
          </div>
        }
        @if(cronInputFormControl().hasError('intervalError')){
          <div class="mt-3 alert alert-warning">
            {{cronInputFormControl().getError('intervalError')}}
          </div>
        }
      </div>
      <hr>
      <div class="btn-group">
        @for (cronOption of cronOptions; track $index) {
          <button class="btn btn-sm btn-secondary"
                  type="button" (click)="setCronOption(cronOption[0])">
            {{ cronOption[0] }}
          </button>
        }
      </div>
      <hr>
      <div class="form-text">
        Write your own
        <a href="https://www.quartz-scheduler.org/documentation/quartz-2.3.0/tutorials/tutorial-lesson-06.html"
           target="_blank">
          cron expression.
        </a>
      </div>
    </div>
  `
})
export class JobSchedulerDialogView {
  requestable = input.required<Requestable>();
  notebookState = input.required<object>();
  cronInput = input<string>('');
  protected cronOptions = new Map([
    ['None', ''],
    ['1h', '0 0 0/1 * * ?'],
    ['3h', '0 0 0/3 * * ?'],
    ['6h', '0 0 0/6 * * ?'],
    ['12h', '0 0 0/12 * * ?'],
    ['1D', '0 0 0 * * ?']
  ]);

  cronInputFormControl = computed(() => new FormControl(
    this.cronInput(),
    [
      this.cronValidator(),
      this.intervalValidator()
    ]
  ));

  protected setJobSchedule():void{
    if(this.cronInputFormControl().valid){
      const notebookConfig = {
        ...this.notebookState()['config'],
        cron:this.cronInputFormControl().value,
      };
      const notebookName = this.notebookState()['title'];
      const noteUpdateRequest = new NoteUpdateRequest(this.requestable(), notebookConfig, notebookName);
      noteUpdateRequest.send();
    }
  }

  protected setCronOption(cronOptionId:string):void{
    const cronValue = this.cronOptions.get(cronOptionId);
    this.cronInputFormControl().setValue(cronValue);
  }

  private minInterval= 3600000;

  private intervalValidator():ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      let validationErrors: ValidationErrors | null = null;
      try{
        const currentValue = control.value;
        if(currentValue !== ''){
          const expression = parser.parseExpression(control.value);
          const date1 = new Date(expression.next().toDate());
          const date2 = new Date(expression.next().toDate());
          const diff = Math.abs(date2.getTime() - date1.getTime());
          if(diff < this.minInterval){
            validationErrors = {intervalError: 'The intervals in this cron expression are dangerously short. Please extend intervals.'};
          }
        }
      }
      catch{
        validationErrors = null;
      }
      return validationErrors;
    };
  }

  private cronValidator():ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let validationErrors = null;
      const currentValue = control.value;
      try{
        parser.parseExpression(currentValue);
      }
      catch(err){
        validationErrors = {cronError: err};
      }
      return validationErrors;
    };
  }
}
