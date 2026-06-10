import {NotebookAngularDraw} from './notebookAngularDraw';
import {ParagraphCollection} from '../../../objects/paragraphCollection/paragraphCollection';
import {Notebook} from '../../../objects/notebook/notebook';

export class NotebookAngularDrawImpl implements NotebookAngularDraw {
  private readonly _notebook:Notebook;
  private _paragraphCollection:ParagraphCollection;

  constructor(notebook:Notebook) {
    this._notebook = notebook;
    this._paragraphCollection = this._notebook.paragraphCollection();
  }

  id(): string{
    return this._notebook.id();
  }

  paragraphCollection(): ParagraphCollection{
    return this._paragraphCollection;
  }

  draw(): void {
    this._paragraphCollection = this._notebook.paragraphCollection();
  }
}
