import {ParagraphMessage} from './paragraphMessage';
import {Paragraph} from '../../../paragraph/paragraph';
import {Channel} from '../../../channel/channel';
import {MessageImpl} from '../../../message/messageImpl';
import {SafeJsonImpl} from '../../../safeJson/safeJsonImpl';
import {ParagraphImpl} from '../../../paragraph/paragraphImpl';

export class ParagraphMessageImpl implements ParagraphMessage {
  private readonly _json:object;

  constructor(json:object) {
    this._json = json;
  }

  paragraph(channel: Channel): Paragraph {
    const message = new MessageImpl(new SafeJsonImpl(this._json));
    if(message.operation() !== 'PARAGRAPH'){
      throw new RangeError('Message operation is not "PARAGRAPH".');
    }
    return new ParagraphImpl(channel, message.data());
  }
}
