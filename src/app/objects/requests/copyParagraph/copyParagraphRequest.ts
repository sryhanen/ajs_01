import {RequestMessage} from '../requestMessage';
import {Requestable} from '../../channel/requestable';
import {SafeJsonImpl} from '../../safeJson/safeJsonImpl';

export class CopyParagraphRequest implements RequestMessage {
  private readonly _requestable: Requestable;
  private readonly _index: number;
  private readonly _paragraphData:object;

  constructor(requestable: Requestable, index:number, paragraphData:object) {
    this._requestable = requestable;
    this._index = index;
    this._paragraphData = paragraphData;
  }

  send(): void {
    const safeParagraphData = new SafeJsonImpl(this._paragraphData);
    this._requestable.request({
      op:'COPY_PARAGRAPH',
      data:{
        index:this._index,
        title:safeParagraphData.getProperty('title', 'string'),
        paragraph:safeParagraphData.getProperty('text', 'string'),
        config:safeParagraphData.getProperty('config', 'object'),
        params:safeParagraphData.getProperty('settings', 'object'),
      }
    });
  }
}
