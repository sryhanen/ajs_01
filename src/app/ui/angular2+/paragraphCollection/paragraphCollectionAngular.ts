import {ParagraphCollection} from '../../../objects/paragraphCollection/paragraphCollection';
import {Paragraph} from '../../../objects/paragraph/paragraph';

export interface ParagraphCollectionAngular extends ParagraphCollection{
  paragraphs(): Map<string, Paragraph>;
}
