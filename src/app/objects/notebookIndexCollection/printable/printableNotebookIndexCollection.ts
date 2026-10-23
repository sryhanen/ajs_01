import {Printable} from '../../rendering/printable/printable';
import {computed, Signal, signal, WritableSignal} from '@angular/core';
import {RenderNodeImpl} from '../../rendering/renderNode/renderNodeImpl';
import {RegisteredComponents} from '../../../ui/angular2+/componentRegistry/registeredComponents';
import {RenderNode} from '../../rendering/renderNode/renderNode';
import {NotebookIndex} from '../../notebookIndex/notebookIndex';

export class PrintableNotebookIndexCollection implements Printable {
  private readonly _renderNode:Signal<RenderNode>;

  constructor(notebookIndices: WritableSignal<Map<string, NotebookIndex>>) {
    this._renderNode = signal(new RenderNodeImpl(RegisteredComponents.NOTEBOOK_INDEX_COLLECTION_VIEW, computed(() => ({
      notebookIndices: Array.from(notebookIndices().values()).map(notebookIndex => notebookIndex.print()())
    }))));
  }

  print(): Signal<RenderNode> {
    return this._renderNode;
  }
}
