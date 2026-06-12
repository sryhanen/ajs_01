import {NotebookAngular} from '../notebook/notebookAngular';
import {NotebookCollection} from '../../../objects/notebookCollection/notebookCollection';

export interface NotebookCollectionAngular extends NotebookCollection {
  notebooks(): NotebookAngular[];
}
