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
import {
  ChangeDetectorRef,
  Component,
  inject,
  Input, OnInit,
} from '@angular/core';
import {OutputSwitcher} from '../../../objects/output/switcher/outputSwitcher';
import {OutputSwitcherButtonView} from './button/outputSwitcherButtonView';
import {OutputSwitcherButton} from '../../../objects/output/switcher/button/outputSwitcherButton';
import {PushValue} from '../../../objects/pushValue/pushValue';
import {PushValueImpl} from '../../../objects/pushValue/pushValueImpl';
import {PushValueWithChangeDetection} from '../../../objects/pushValue/pushValueWithChangeDetection';

@Component({
  selector: 'output-switcher',
  imports: [
    OutputSwitcherButtonView
  ],
  template: `
    @if (isSwitchable.value()) {
      <div class="btn-group" role="group">
        @for (button of outputSwitcherButtons; track $index) {
          <output-switcher-button class="btn-group" [outputSwitcherButton]="button"
                                  [outputSwitcher]="outputSwitcher"></output-switcher-button>
        }
      </div>
      @if (isLoading.value()) {
        <div class="spinner-border mx-2 text-primary" role="status"></div>
      }
    }
  `
})
export class OutputSwitcherView implements OnInit{
  @Input({required:true}) outputSwitcher:OutputSwitcher;
  @Input({required:true}) outputSwitcherButtons: OutputSwitcherButton[];
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected isSwitchable:PushValue<boolean>;
  protected isLoading:PushValue<boolean>;

  ngOnInit(): void {
    this.isSwitchable = new PushValueWithChangeDetection(new PushValueImpl(), this.cdr);
    this.isLoading = new PushValueWithChangeDetection(new PushValueImpl(), this.cdr);
    this.outputSwitcher.pushIsSwitchable(this.isSwitchable);
    this.outputSwitcher.pushIsLoading(this.isLoading);
  }
}
