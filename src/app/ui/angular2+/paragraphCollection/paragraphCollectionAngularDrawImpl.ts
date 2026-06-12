import {ParagraphCollection} from '../../../objects/paragraphCollection/paragraphCollection';
import {ParagraphCollectionAngularDraw} from './paragraphCollectionAngularDraw';
import {Paragraph} from '../../../objects/paragraph/paragraph';

export class ParagraphCollectionAngularDrawImpl implements ParagraphCollectionAngularDraw {
  private readonly _paragraphCollection: ParagraphCollection;
  private _paragraphs: Map<string, Paragraph>;

  constructor(paragraphCollection: ParagraphCollection) {
    this._paragraphCollection = paragraphCollection;
    this._paragraphs = this._paragraphCollection.paragraphs();
  }

  paragraphs(): Map<string, Paragraph>{
    return this._paragraphs;
  }

  draw(): void {
    this._paragraphs = this._paragraphCollection.paragraphs();
  }
}
