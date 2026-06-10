import {ParagraphCollection} from '../../../objects/paragraphCollection/paragraphCollection';
import {AngularDraw} from '../angularDraw/angularDraw';
import {Paragraph} from '../../../objects/paragraph/paragraph';

export interface ParagraphCollectionAngularDraw extends Partial<ParagraphCollection>, AngularDraw {
  paragraphs(): Paragraph[];
}
