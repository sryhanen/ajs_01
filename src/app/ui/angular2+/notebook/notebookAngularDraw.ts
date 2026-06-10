import {AngularDraw} from '../angularDraw/angularDraw';
import {Notebook} from '../../../objects/notebook/notebook';
import {ParagraphCollection} from '../../../objects/paragraphCollection/paragraphCollection';

export interface NotebookAngularDraw extends Partial<Notebook>, AngularDraw {
  id(): string;
  paragraphCollection(): ParagraphCollection;
}
