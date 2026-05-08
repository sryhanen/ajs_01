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
import {Channel} from '../channel/channel';
import {Paragraph} from '../paragraph/paragraph';
import {PushValue} from '../pushValue/pushValue';
import {AngularObjectCollection} from '../angularObjectCollection/angularObjectCollection';
import {Response} from '../channel/response';

export class ParagraphCollectionImpl implements ParagraphCollection {
  private readonly _channel: Channel;
  private readonly _paragraphs: Paragraph[];
  private readonly _pushParagraphs: PushValue<Paragraph[]>[];
  private readonly _angularObjectCollection: AngularObjectCollection;
  private readonly _responses: Response[];

  constructor(channel: Channel, paragraphs: Paragraph[], angularObjectCollection: AngularObjectCollection) {
    this._channel = channel;
    this._paragraphs = paragraphs;
    this._angularObjectCollection = angularObjectCollection;
    this._pushParagraphs = [];
    this._responses = [];
  }

  paragraphs(value: PushValue<Paragraph[]>): void {
    value.update(this._paragraphs);
    this._pushParagraphs.push(value);
  }

  request(data: object): void {
    //if(message.op === 'RUN_PARAGRAPH'){
    //  const runParagraphMessage = data as MessageDTO<RunParagraphDTO>;
    //  const paragraphDto = this._paragraphs.find(paragraph => paragraph.id() === runParagraphMessage.data.id).print();
    //  runParagraphMessage.data.paragraph = paragraphDto.text;
    //  runParagraphMessage.data.config = paragraphDto.config;
    //  runParagraphMessage.data.params = paragraphDto.params;
    //  this._channel.request(runParagraphMessage);
    //}
    //this._channel.request(message);
  }

  response(data: object): void {
    this._responses.forEach(responder => responder.response(data));
    //const message = new MessageImpl(data);
    //const op = message.operation();
    //if(op === 'PARAGRAPH_ADDED'){
    //  const paragraphAddedData = new ParagraphAddedDataImpl(message.data());
    //  const index = paragraphAddedData.index();
    //  const paragraph = paragraphAddedData.paragraph(this, this._angularObjectCollection);
    //  this._paragraphs.splice(index,0, paragraph);
    //  this._pushParagraphs.forEach(value => value.update(this._paragraphs));
    //}
    //else if(op === 'PARAGRAPH_REMOVED'){
    //  const paragraphRemovedData = new ParagraphRemovedDataImpl(message.data());
    //  const index = this._paragraphs.findIndex(paragraph => paragraph.id() === paragraphRemovedData.id());
    //  this._paragraphs.splice(index, 1);
    //  this._pushParagraphs.forEach(value => value.update(this._paragraphs));
    //}
    //else {
    //  this._paragraphs.forEach(paragraph => {
    //    paragraph.response(data);
    //  });
    //}
  }
}
