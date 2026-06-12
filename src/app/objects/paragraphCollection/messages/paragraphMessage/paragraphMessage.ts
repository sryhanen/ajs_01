import {Paragraph} from '../../../paragraph/paragraph';
import {Channel} from '../../../channel/channel';

export interface ParagraphMessage {
  paragraph(channel:Channel): Paragraph;
}
