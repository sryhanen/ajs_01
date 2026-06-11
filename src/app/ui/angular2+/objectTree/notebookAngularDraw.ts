import {Notebook} from '../../../objects/notebook/notebook';
import {ParagraphCollection} from '../../../objects/paragraphCollection/paragraphCollection';
import {ParagraphCollectionAngularDraw} from '../paragraphCollection/paragraphCollectionAngularDraw';
import {AngularDraw} from '../angularDraw/angularDraw';
import {Response} from '../../../objects/channel/response';
import {ParagraphCollectionAngularDrawImpl} from '../paragraphCollection/paragraphCollectionAngularDrawImpl';

interface NotebookAngularDraw extends AngularDraw, Response {
  paragraphCollection():ParagraphCollectionAngularDraw;
}

export class NotebookAngularDrawImpl implements NotebookAngularDraw {
  private readonly _notebook:Notebook;
  private _paragraphCollection:ParagraphCollectionAngularDraw;

  constructor(notebook:Notebook) {
    this._notebook = notebook;
    this._paragraphCollection = new ParagraphCollectionAngularDrawImpl(this._notebook.paragraphCollection());
  }

  id(): string{
    return this._notebook.id();
  }

  paragraphCollection(): ParagraphCollectionAngularDraw{
    return this._paragraphCollection;
  }

  draw(): void {
    this._paragraphCollection = new ParagraphCollectionAngularDrawImpl(this._notebook.paragraphCollection());
  }

  response(data: object) {
    this._paragraphCollection.response(data);
    this.draw();
  }
}
