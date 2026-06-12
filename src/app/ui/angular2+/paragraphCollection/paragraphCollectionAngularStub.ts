import {ParagraphCollectionAngular} from './paragraphCollectionAngular';
import {Paragraph} from '../../../objects/paragraph/paragraph';

export class ParagraphCollectionAngularStub implements ParagraphCollectionAngular {
  isStub(): boolean {
    return true;
  }

  paragraphs(): Map<string, Paragraph> {
    throw new Error('ParagraphCollectionAngularStub: Method not implemented');
  }

  request(data: object): void {
    throw new Error('ParagraphCollectionAngularStub: Method not implemented');
  }

  response(data: object): void {
    throw new Error('ParagraphCollectionAngularStub: Method not implemented');
  }

}
