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
import {Component, inject, Input, OnInit, signal, effect, ViewContainerRef, ComponentRef} from '@angular/core';
import {OutputContainer} from '../../../objects/output/container/outputContainer';
import {OutputSwitcherView} from '../switcher/outputSwitcherView';
import {InterpreterErrorDirective} from '../../../directives/interpreterErrorDirective';
import {OutputSwitcherButton} from '../../../objects/output/switcher/button/outputSwitcherButton';
import {PushValue} from '../../../objects/pushValue/pushValue';
import {OutputPlugin} from '../../../objects/output/plugins/outputPlugin';
import {PluginView} from '../plugin/pluginView';
import {WritableSignalAsPushValue} from '../../../objects/pushValue/writableSignalAsPushValue';
import {OutputPluginStub} from '../../../objects/output/plugins/outputPluginStub';

@Component({
  selector: 'output-container',
  imports: [
    OutputSwitcherView,
    InterpreterErrorDirective,
  ],
  template: `
      <output-switcher [interpreter-error-popup]="outputContainer.errorListener()" [outputSwitcher]="outputContainer.outputSwitcher()" [outputSwitcherButtons]="outputSwitcherButtons"></output-switcher>
      <ng-content></ng-content>
  `
})
export class OutputContainerView implements OnInit {
  @Input({required:true}) outputContainer: OutputContainer;
  protected outputSwitcherButtons: OutputSwitcherButton[];
  protected outputPlugin: PushValue<OutputPlugin>;
  private viewContainer = inject(ViewContainerRef);
  protected pluginSignal= signal(new OutputPluginStub());
  private previousInstance: ComponentRef<PluginView>;
  private pluginChange = effect(() => {
    if(!this.pluginSignal().isStub()){
      const newInstance = this.viewContainer.createComponent(PluginView);
      newInstance.setInput('plugin', this.pluginSignal());
      if(this.previousInstance !== undefined){
        this.previousInstance.destroy();
      }
      this.previousInstance = newInstance;
    }
  });

  ngOnInit(): void {
    this.outputSwitcherButtons = this.outputContainer.outputFormats().map(format => format.switcherButtons().filter(button => !button.isStub())).flat();
    this.outputPlugin = new WritableSignalAsPushValue(this.pluginSignal);
    this.outputContainer.outputPlugin(this.outputPlugin);
  }
}
