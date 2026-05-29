import {ParagraphCollection} from './paragraphCollection';
import {PushValue} from '../pushValue/pushValue';
import {Paragraph} from '../paragraph/paragraph';

export class ParagraphCollectionStub implements ParagraphCollection {
  isStub(): boolean {
    return true;
  }

  paragraphs(value: PushValue<Paragraph[]>): void {
    throw new Error('ParagraphCollectionStub: method not implemented.');
  }

  request(data: object): void {
    throw new Error('ParagraphCollectionStub: method not implemented.');
  }

  response(data: object): void {
    throw new Error('ParagraphCollectionStub: method not implemented.');
  }
}
