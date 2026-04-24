import {MessageDTO} from '../messageDTO';
import {ParagraphOutputDTO} from '../paragraphOutputMessage/paragraphOutputDTO';
import {ParagraphDTO} from './paragraphDTO';

export interface ParagraphMessage {
  id():string;
  printAsParagraphOutputMessage(): MessageDTO<ParagraphOutputDTO>;
  toParagraphData(): ParagraphDTO;
}
