import {NotebookCollectionAngularDraw} from './notebookCollectionAngularDraw';
import {Notebook} from '../../../objects/notebook/notebook';
import {NotebookCollection} from '../../../objects/notebookCollection/notebookCollection';

export class NotebookCollectionAngularDrawImpl implements NotebookCollectionAngularDraw {
  private readonly _notebookCollection: NotebookCollection;
  private _notebooks: Notebook[];

  constructor(notebookCollection: NotebookCollection) {
    this._notebookCollection = notebookCollection;
    this._notebooks = this._notebookCollection.notebooks();
  }

  draw(): void {
    this._notebooks = this._notebookCollection.notebooks();
  }

  notebooks(): Notebook[] {
    return this._notebooks;
  }
}
