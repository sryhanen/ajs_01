/*
 * Teragrep User Interface (ajs_01)
 * Copyright (C) 2019-2026 Suomen Kanuuna Oy
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 *
 * Additional permission under GNU Affero General Public License version 3
 * section 7
 *
 * If you modify this Program, or any covered work, by linking or combining it
 * with other code, such other code is not for that reason alone subject to any
 * of the requirements of the GNU Affero GPL version 3 as long as this Program
 * is the same Program as licensed from Suomen Kanuuna Oy without any additional
 * modifications.
 *
 * Supplemented terms under GNU Affero General Public License version 3
 * section 7
 *
 * Origin of the software must be attributed to Suomen Kanuuna Oy. Any modified
 * versions must be marked as "Modified version of" The Program.
 *
 * Names of the licensors and authors may not be used for publicity purposes.
 *
 * No rights are granted for use of trade names, trademarks, or service marks
 * which are in The Program if any.
 *
 * Licensee must indemnify licensors and authors for any liability that these
 * contractual assumptions impose on licensors and authors.
 *
 * To the extent this program is licensed as part of the Commercial versions of
 * Teragrep, the applicable Commercial License may apply to this file if you as
 * a licensee so wish it.
 */
import {ParagraphCollection} from './paragraphCollection';
import {PushValue} from '../pushValue/pushValue';
import {Paragraph} from '../paragraph/paragraph';
import {Channel} from '../channel/channel';
import {MessageDTO} from '../message/messageDTO';
import {RunParagraphDTO} from '../message/runParagraphMessage/runParagraphDTO';
import {RunParagraphDTOStub} from '../message/runParagraphMessage/runParagraphDTOStub';
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
