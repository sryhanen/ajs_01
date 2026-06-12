import {ParagraphAddedMessage} from './paragraphAddedMessage';
import {Paragraph} from '../../../paragraph/paragraph';
import {SafeJsonImpl} from '../../../safeJson/safeJsonImpl';
import {MessageImpl} from '../../../message/messageImpl';
import {Channel} from '../../../channel/channel';
import {ParagraphImpl} from '../../../paragraph/paragraphImpl';

export class ParagraphAddedMessageImpl implements ParagraphAddedMessage {
  private readonly _json:object;

  constructor(json:object) {
    this._json = json;
  }

  paragraphWithIndex(channel: Channel): { paragraph: Paragraph; index: number } {
    const message = new MessageImpl(new SafeJsonImpl(this._json));
    if(message.operation() !== 'PARAGRAPH_ADDED'){
      throw new RangeError('Message operation is not "PARAGRAPH_ADDED".');
    }
    const messageData = new SafeJsonImpl(message.data());
    const paragraph = new ParagraphImpl(channel, messageData.getProperty('paragraph', 'object'));
    const index:number = messageData.getProperty('index', 'number');
    return {
      paragraph:paragraph,
      index: index
    };
  }
}
