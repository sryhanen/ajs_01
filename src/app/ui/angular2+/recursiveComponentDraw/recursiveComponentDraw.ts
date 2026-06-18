import {Component, inject, input, OnInit} from '@angular/core';
import {NgComponentOutlet} from '@angular/common';
import {WebAppComponentRegistry} from '../webAppComponentRegistry/webAppComponentRegistry';
import {WebAppComponentRegistryImpl} from '../webAppComponentRegistry/webAppComponentRegistryImpl';
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
    @for (child of renderNode().children(); track $index) {
      <recursive-component-draw [renderNode]="child" [noteId]="noteId()"
                                [paragraphId]="paragraphId()"></recursive-component-draw>
    }
  `
})
export class RecursiveComponentDraw implements OnInit {
  renderNode = input.required<RenderNode>();
  paragraphId = input.required<string>();
  noteId = input.required<string>();
  protected componentRegistry:WebAppComponentRegistry = inject(WebAppComponentRegistryImpl);
  protected component: {new(): unknown};
  protected inputs: Record<string, unknown>;

  ngOnInit() {
    this.component = this.componentRegistry.resolve(this.renderNode().type);
    this.inputs = this.renderNode().data();
    this.inputs['paragraphId'] = this.paragraphId();
    this.inputs['noteId'] = this.noteId();
  }
}
