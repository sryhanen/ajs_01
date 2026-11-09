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
import {OutputView} from './outputView';
import {
  AfterViewInit,
  Component, ComponentRef,
  inject,
  input,
  OnDestroy, OnInit,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Output} from './output';
import {COMPONENT_REGISTRY} from '../../angular2+/componentRegistry/componentRegistry';
import {OutputSwitcherViewImpl} from '../outputSwitcher/outputSwitcherViewImpl';
import {OutputSwitcher} from '../outputSwitcher/outputSwitcher';
import {ViewNodeReference} from '../viewNode/viewNodeReference';
import {RegisteredComponents} from '../../angular2+/componentRegistry/registeredComponents';

@Component({
  selector: 'output-view',
  template: `
    <ng-container #switcherContainer/>
    <ng-container #outputContainer/>
  `
})
export class OutputViewImpl implements OutputView, OnInit, AfterViewInit, OnDestroy{
  output = input.required<Output>();
  @ViewChild('switcherContainer', {read:ViewContainerRef}) private switcherContainer: ViewContainerRef;
  @ViewChild('outputContainer', {read:ViewContainerRef}) private outputContainer: ViewContainerRef;
  private viewNodeReference:ViewNodeReference;
  private previousComponentReference: { componentName: string, componentRef: ComponentRef<unknown> };

  ngOnInit() {
    this.viewNodeReference =  this.output().attachView(this, 'output');
  }

  ngAfterViewInit() {
    this.output().project(this);
  }

  ngOnDestroy(): void {
    this.viewNodeReference.destroy();
  }

  private readonly componentRegistry = inject(COMPONENT_REGISTRY);

  protected componentInstance(componentId:string):Type<unknown>{
    return this.componentRegistry.get(componentId);
  }

  render(component:{componentReference: string, inputs: Record<string, unknown>}):void{
    const datatablesComponentReference = RegisteredComponents.DATATABLES_OUTPUT_VIEW;
    if(this.previousComponentReference && this.previousComponentReference.componentName === datatablesComponentReference && component.componentReference === datatablesComponentReference){
      for(const [name,value] of Object.entries(component.inputs)) {
        this.previousComponentReference.componentRef.setInput(name, value);
      }
    }
    else{
      this.outputContainer.clear();
      const componentName = component.componentReference;
      const componentRef = this.outputContainer.createComponent(this.componentInstance(componentName));
      for(const [name,value] of Object.entries(component.inputs)) {
        componentRef.setInput(name, value);
      }
      this.previousComponentReference = {
        componentRef:componentRef,
        componentName:componentName
      };
    }

  }

  attachSwitcher(outputSwitcher: OutputSwitcher): void {
    this.switcherContainer.clear();
    const componentRef = this.switcherContainer.createComponent(OutputSwitcherViewImpl);
    componentRef.setInput('outputSwitcher', outputSwitcher);
  }

  attachInterpreterErrorListener(interpreterErrorListener: object): void {
    throw new Error('Method not implemented.');
  }
}
