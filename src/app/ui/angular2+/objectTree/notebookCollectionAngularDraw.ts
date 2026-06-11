import {NotebookCollection} from '../../../objects/notebookCollection/notebookCollection';
import {NotebookAngularDraw} from '../notebook/notebookAngularDraw';
import {AngularDraw} from '../angularDraw/angularDraw';
import {Response} from '../../../objects/channel/response';
import {NotebookAngularDrawImpl} from '../notebook/notebookAngularDrawImpl';

interface hashable {
  hashcode():string;
}


interface NotebookCollectionAngularDraw extends AngularDraw, Response {
  notebooks(): NotebookAngularDraw[];
}

export class NotebookCollectionAngularDrawImpl implements NotebookCollectionAngularDraw {
  private readonly _notebookCollection: NotebookCollection;
  private _notebooks: NotebookAngularDraw[];

  constructor(notebookCollection: NotebookCollection) {
    this._notebookCollection = notebookCollection;
    this._notebooks = this._notebookCollection.notebooks().map(notebook => new NotebookAngularDrawImpl(notebook));
  }

  draw(): void {
    this._notebooks = this._notebookCollection.notebooks().map(notebook => new NotebookAngularDrawImpl(notebook));
  }

  notebooks(): NotebookAngularDraw[] {
    return this._notebooks;
  }

  response(data:object):void{
    this._notebookCollection.response(data);
    this.draw();
  }
}
