import {ParagraphCollection} from './paragraphCollection';
import {PushValue} from '../pushValue/pushValue';
import {Paragraph} from '../paragraph/paragraph';
import {Channel} from '../channel/channel';
import {MessageDTO} from '../message/messageDTO';
import {RunParagraphDTO} from '../message/runParagraphMessage/runParagraphDTO';
import {AngularObjectCollection} from '../angularObjectCollection/angularObjectCollection';
import {SafeJsonImpl} from '../safeJson/safeJsonImpl';
import {ParagraphAddedMessageImpl} from '../message/paragraphAddedMessage/paragraphAddedMessageImpl';
import {ParagraphRemovedMessageImpl} from '../message/paragraphRemovedMessage/paragraphRemovedMessageImpl';

export class ParagraphCollectionImpl implements ParagraphCollection {
  private readonly _channel: Channel;
  private readonly _paragraphs: Paragraph[];
  private readonly _pushParagraphs: PushValue<Paragraph[]>[];
  private readonly _angularObjectCollection: AngularObjectCollection;

  constructor(channel: Channel, paragraphs: Paragraph[], angularObjectCollection: AngularObjectCollection) {
    this._channel = channel;
    this._paragraphs = paragraphs;
    this._angularObjectCollection = angularObjectCollection;
    this._pushParagraphs = [];
  }

  paragraphs(value: PushValue<Paragraph[]>): void {
    value.update(this._paragraphs);
    this._pushParagraphs.push(value);
  }

  request(data: object): void {
    const message = data as MessageDTO<unknown>;
    if(message.op === 'RUN_PARAGRAPH'){
      const runParagraphMessage = data as MessageDTO<RunParagraphDTO>;
      const paragraphDto = this._paragraphs.find(paragraph => paragraph.id() === runParagraphMessage.data.id).print();
      runParagraphMessage.data.paragraph = paragraphDto.text;
      runParagraphMessage.data.config = paragraphDto.config;
      runParagraphMessage.data.params = paragraphDto.params;
      this._channel.request(runParagraphMessage);
    }
    this._channel.request(message);
  }

  response(data: object): void {
    const message = data as MessageDTO<object>;
    const op = message.op;
    if(op === 'PARAGRAPH_ADDED'){
      const paragraphAddedMessage = new ParagraphAddedMessageImpl(new SafeJsonImpl(message.data));
      const paragraph = paragraphAddedMessage.paragraph(this, this._angularObjectCollection);
      const index = paragraphAddedMessage.index();
      this._paragraphs.splice(index,0, paragraph);
      this._pushParagraphs.forEach(value => value.update(this._paragraphs));
    }
    else if(op === 'PARAGRAPH_REMOVED'){
      const paragraphRemovedMessage = new ParagraphRemovedMessageImpl(new SafeJsonImpl(message.data));
      const id = paragraphRemovedMessage.id();
      const index = this._paragraphs.findIndex(paragraph => paragraph.id() === id);
      this._paragraphs.splice(index, 1);
      this._pushParagraphs.forEach(value => value.update(this._paragraphs));
    }
    else {
      this._paragraphs.forEach(paragraph => {
        paragraph.response(data);
      });
    }
  }
}
