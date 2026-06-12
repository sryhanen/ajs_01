import {NotebookAngular} from './notebookAngular';
import {Notebook} from '../../../objects/notebook/notebook';
import {ParagraphCollectionAngular} from '../paragraphCollection/paragraphCollectionAngular';
import {ParagraphCollectionAngularImpl} from '../paragraphCollection/paragraphCollectionAngularImpl';
import {signal, WritableSignal} from '@angular/core';
import {ParagraphCollectionAngularStub} from '../paragraphCollection/paragraphCollectionAngularStub';

export class NotebookAngularImpl implements NotebookAngular {
  private readonly _notebook:Notebook;
  private readonly _paragraphCollection:WritableSignal<ParagraphCollectionAngular>;

  constructor(notebook:Notebook) {
    this._notebook = notebook;
    this._paragraphCollection = signal(this.paragraphCollectionAngular());
  }

  private paragraphCollectionAngular(): ParagraphCollectionAngular {
    let paragraphCollectionAngular:ParagraphCollectionAngular;
    if(this._notebook.paragraphCollection().isStub()){
      paragraphCollectionAngular = new ParagraphCollectionAngularStub();
    }
    else{
      paragraphCollectionAngular = new ParagraphCollectionAngularImpl(this._notebook.paragraphCollection());
    }
    return paragraphCollectionAngular;
  }

  request(data: object): void {
    this._notebook.request(data);
  }

  response(data: object): void {
    this._paragraphCollection.set(this.paragraphCollectionAngular());
    if(!this._paragraphCollection().isStub()){
      this._paragraphCollection().response(data);
    }
  }

  id(): string{
    return this._notebook.id();
  }

  paragraphCollection(): ParagraphCollectionAngular {
    return this._paragraphCollection();
  }
}
