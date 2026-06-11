import {ParagraphRemovedMessage} from './paragraphRemovedMessage';
import {SafeJsonImpl} from '../../safeJson/safeJsonImpl';
import {MessageImpl} from '../../message/messageImpl';
import {Text} from './text/text';
import {TextStub} from './text/textStub';
import {TextImpl} from './text/textImpl';

export class ParagraphRemovedMessageImpl implements ParagraphRemovedMessage {
  private readonly _json:object;

  constructor(json:object) {
    this._json = json;
  }

  paragraphId(): Text {
    const message = new MessageImpl(new SafeJsonImpl(this._json));
    let paragraphId:Text;

    if(message.operation() !== 'PARAGRAPH_REMOVED') {
      paragraphId = new TextStub();
    }
    else{
      const paragraphRemovedData = new SafeJsonImpl(message.data());
      paragraphId = new TextImpl(paragraphRemovedData.getProperty('id', 'string'));
    }
    return paragraphId;
  }
}
