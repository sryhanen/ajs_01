import {Notebook} from '../../../objects/notebook/notebook';
import {ParagraphCollectionAngular} from '../paragraphCollection/paragraphCollectionAngular';

export interface NotebookAngular extends Notebook {
  paragraphCollection(): ParagraphCollectionAngular;
}
