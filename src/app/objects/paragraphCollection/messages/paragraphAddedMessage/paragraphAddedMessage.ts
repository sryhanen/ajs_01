import {Paragraph} from '../../../paragraph/paragraph';
import {Channel} from '../../../channel/channel';

export interface ParagraphAddedMessage {
  paragraphWithIndex(channel: Channel): {paragraph: Paragraph, index: number};
}
