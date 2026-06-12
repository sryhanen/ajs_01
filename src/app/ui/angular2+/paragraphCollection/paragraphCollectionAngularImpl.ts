import {ParagraphCollection} from '../../../objects/paragraphCollection/paragraphCollection';
import {ParagraphCollectionAngular} from './paragraphCollectionAngular';
import {Paragraph} from '../../../objects/paragraph/paragraph';
import {signal, WritableSignal} from '@angular/core';
import {ParagraphAngularImpl} from '../paragraph/paragraphAngularImpl';

export class ParagraphCollectionAngularImpl implements ParagraphCollectionAngular {
  private readonly _paragraphCollection: ParagraphCollection;
  private readonly _paragraphs: WritableSignal<Map<string, Paragraph>>;

  constructor(paragraphCollection: ParagraphCollection) {
    this._paragraphCollection = paragraphCollection;
    this._paragraphs = signal(this.paragraphMapMappedToParagraphAngularMap());
  }

  private paragraphMapMappedToParagraphAngularMap(): Map<string, Paragraph> {
    const paragraphs = this._paragraphCollection.paragraphs();
    const newParagraphMap = new Map<string, Paragraph>();
    for (const [id, paragraph] of paragraphs) {
      newParagraphMap.set(id, new ParagraphAngularImpl(paragraph));
    }
    return newParagraphMap;
  }

  request(data: object): void {
    this._paragraphCollection.request(data);
  }

  response(data: object): void {
    this._paragraphs.set(this.paragraphMapMappedToParagraphAngularMap());
    this._paragraphs().forEach(paragraph => paragraph.response(data));
  }

  isStub(): boolean {
    return this._paragraphCollection.isStub();
  }

  paragraphs(): Map<string, Paragraph>{
    return this._paragraphs();
  }
}
