import {NotebookCollection} from '../../../objects/notebookCollection/notebookCollection';
import {AngularDraw} from '../angularDraw/angularDraw';
import {Notebook} from '../../../objects/notebook/notebook';

export interface NotebookCollectionAngularDraw extends Partial<NotebookCollection>, AngularDraw {
  notebooks(): Notebook[];
}
