import {ParagraphCollection} from './paragraphCollection';
import {PushValue} from '../pushValue/pushValue';
import {Paragraph} from '../paragraph/paragraph';
import {Channel} from '../channel/channel';
import {MessageDTO} from '../message/messageDTO';
import {RunParagraphDTO, RunParagraphDTOStub} from '../message/runParagraphMessage/runParagraphDTO';
import {AngularObjectCollection} from '../angularObjectCollection/angularObjectCollection';
import {SafeJsonImpl} from '../safeJson/safeJsonImpl';
import {ParagraphAddedMessageImpl} from '../message/paragraphAddedMessage/paragraphAddedMessageImpl';
import {ParagraphRemovedMessageImpl} from '../message/paragraphRemovedMessage/paragraphRemovedMessageImpl';
import {ParagraphMessageImpl} from '../message/paragraphMessage/paragraphMessageImpl';
import {ParagraphImpl} from '../paragraph/paragraphImpl';

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
    const message = data as MessageDTO<object>;
    if(message.op === 'RUN_PARAGRAPH'){
      const runParagraphData = new SafeJsonImpl<RunParagraphDTO>(message.data);
      const runParagraphDto = runParagraphData.deserialized(RunParagraphDTOStub);
      const paragraphDto = this._paragraphs.find(paragraph => paragraph.id() === runParagraphDto.id).print();
      runParagraphDto.paragraph = paragraphDto.text;
      runParagraphDto.config = paragraphDto.config;
      runParagraphDto.params = paragraphDto.settings.params;
      message.data = runParagraphDto;
      this._channel.request(message);
    }
    else {
      this._channel.request(data);
    }
  }

  response(data: object): void {
    const message = data as MessageDTO<object>;
    const op = message.op;
    if(op === 'PARAGRAPH'){
      const paragraphMessage = new ParagraphMessageImpl(new SafeJsonImpl(message.data));
      const paragraphDTO = paragraphMessage.toParagraphDTO();
      const paragraphToReplaceIndex = this._paragraphs.findIndex(paragraph => paragraph.id() === paragraphDTO.id);
      const newParagraph = new ParagraphImpl(this, paragraphDTO, this._angularObjectCollection);
      this._paragraphs.splice(paragraphToReplaceIndex, 1, newParagraph);
      this._pushParagraphs.forEach(value => value.update(this._paragraphs));
    }
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
    else{
      this._paragraphs.forEach(paragraph => {
        paragraph.response(data);
      });
    }
  }
}
