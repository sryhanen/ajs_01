import {NotebookCollection} from '../../../objects/notebookCollection/notebookCollection';
import {signal, WritableSignal} from '@angular/core';
import {NotebookAngular} from '../notebook/notebookAngular';
import {NotebookAngularImpl} from '../notebook/notebookAngularImpl';

export class NotebookCollectionAngularImpl implements NotebookCollection {
  private readonly _notebookCollection: NotebookCollection;
  private readonly _notebooks: WritableSignal<NotebookAngular[]>;

  constructor(notebookCollection: NotebookCollection) {
    this._notebookCollection = notebookCollection;
    this._notebooks = signal(this._notebookCollection.notebooks().map(notebook => new NotebookAngularImpl(notebook)));
  }

  request(data: object): void {
    this._notebookCollection.request(data);
  }

  response(data: object): void {
    this._notebooks.update(() => [...this._notebookCollection.notebooks().map(notebook => new NotebookAngularImpl(notebook))]);
    this._notebooks().forEach(notebook => notebook.response(data));
  }

  notebooks(): NotebookAngular[] {
    return this._notebooks();
  }
}
