import {ParagraphRemovedMessage} from './paragraphRemovedMessage';
import {MessageImpl} from '../../../message/messageImpl';
import {SafeJsonImpl} from '../../../safeJson/safeJsonImpl';

export class ParagraphRemovedMessageImpl implements ParagraphRemovedMessage {
  private readonly _json:object;

  constructor(json:object) {
    this._json = json;
  }

  removedParagraphId(): string {
    const message = new MessageImpl(new SafeJsonImpl(this._json));
    if(message.operation() !== 'PARAGRAPH_REMOVED'){
      throw new RangeError('Message operation is not "PARAGRAPH_REMOVED".');
    }
    const messageData = new SafeJsonImpl(message.data());
    return messageData.getProperty('id', 'string');
  }
}
