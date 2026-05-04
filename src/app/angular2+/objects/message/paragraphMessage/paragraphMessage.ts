import {MessageDTO} from '../messageDTO';
import {ParagraphOutputDTO} from '../paragraphOutputMessage/paragraphOutputDTO';
import {ParagraphDTO} from './paragraphDTO';

export interface ParagraphMessage {
  printAsParagraphOutputMessage(): MessageDTO<ParagraphOutputDTO>;
  toParagraphDTO(): ParagraphDTO;
}
