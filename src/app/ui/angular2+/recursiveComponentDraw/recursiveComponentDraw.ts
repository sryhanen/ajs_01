import {Component, inject, input, OnInit, Signal} from '@angular/core';
import {NgComponentOutlet} from '@angular/common';
import {WebAppComponentRegistry} from '../webAppComponentRegistry/webAppComponentRegistry';
import {WebAppComponentRegistryImpl} from '../webAppComponentRegistry/webAppComponentRegistryImpl';
import {Render} from '../../../objects/render/render';
import {RenderNode} from '../../../objects/render/renderNode';

@Component({
  selector: 'recursive-component-draw',
  imports: [
    NgComponentOutlet
  ],
  template: `
    <ng-container
      *ngComponentOutlet="component; inputs: inputs">
    </ng-container>
    @for(child of renderNode().children(); track $index){
      <recursive-component-draw [render]="child" [noteId]="noteId()" [paragraphId]="paragraphId()"></recursive-component-draw>
    }
  `
})
export class RecursiveComponentDraw implements OnInit {
  render = input.required<Render>();
  paragraphId = input.required<string>();
  noteId = input.required<string>();
  protected componentRegistry:WebAppComponentRegistry = inject(WebAppComponentRegistryImpl);
  protected component: {new(): unknown};
  protected inputs: Record<string, unknown>;
  protected renderNode: Signal<RenderNode>;

  ngOnInit() {
    this.renderNode = this.render().render();
    this.component = this.componentRegistry.resolve(this.renderNode().type);
    this.inputs = {...{noteId:this.noteId(), paragraphId: this.paragraphId()}, ...this.renderNode().data()};
  }
}
