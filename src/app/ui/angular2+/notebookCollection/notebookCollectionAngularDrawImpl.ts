import {NotebookCollectionAngularDraw} from './notebookCollectionAngularDraw';
import {Notebook} from '../../../objects/notebook/notebook';
import {NotebookCollection} from '../../../objects/notebookCollection/notebookCollection';
import {signal, WritableSignal} from '@angular/core';

export class NotebookCollectionAngularDrawImpl implements NotebookCollectionAngularDraw {
  private readonly _notebookCollection: NotebookCollection;
  private readonly _notebooks: WritableSignal<Notebook[]>;

  constructor(notebookCollection: NotebookCollection) {
    this._notebookCollection = notebookCollection;
    this._notebooks = signal(this._notebookCollection.notebooks());
  }

  draw(): void {
    this._notebooks.set(this._notebookCollection.notebooks());
  }

  notebooks(): Notebook[] {
    return this._notebooks();
  }
}
