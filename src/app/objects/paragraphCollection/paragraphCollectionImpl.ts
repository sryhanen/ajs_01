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
import {Channel} from '../channel/channel';
import {Paragraph} from '../paragraph/paragraph';
import {ParagraphCollection} from './paragraphCollection';
import {ParagraphImpl} from '../paragraph/paragraphImpl';
import {ResponseChannel} from '../responseChannel/responseChannel';
import {ResponseChannelImpl} from '../responseChannel/responseChannelImpl';
import {ParagraphAddedMessageImpl} from './messages/paragraphAddedMessage/paragraphAddedMessageImpl';
import {ParagraphRemovedMessageImpl} from './messages/paragraphRemovedMessage/paragraphRemovedMessageImpl';

export class ParagraphCollectionImpl implements ParagraphCollection {
  private readonly _paragraphs: Map<string, Paragraph>;
  private readonly _channel: Channel;
  private readonly _responseChannel: ResponseChannel;

  constructor(channel: Channel, initialParagraphData: object[]) {
    this._channel = channel;
    this._paragraphs = new Map<string, Paragraph>();
    initialParagraphData.forEach(paragraph => {
      const paragraphObject = new ParagraphImpl(this, paragraph);
      this._paragraphs.set(paragraphObject.id(), paragraphObject);
    });
    this._responseChannel = new ResponseChannelImpl();
    this._responseChannel.subscribe('PARAGRAPH_ADDED', (json:object)=> this.addParagraph(json));
    this._responseChannel.subscribe('PARAGRAPH_REMOVED', (json:object)=> this.removeParagraph(json));
  }

  private removeParagraph(json:object):void {
    const paragraphRemovedMessage = new ParagraphRemovedMessageImpl(json);
    this._paragraphs.delete(paragraphRemovedMessage.removedParagraphId());
  }

  private addParagraph(json:object):void {
    const paragraphAddedMessage = new ParagraphAddedMessageImpl(json);
    const paragraphWithIndex = paragraphAddedMessage.paragraphWithIndex(this);
    const paragraphMapCopy = new Map<string, Paragraph>(this._paragraphs);
    this._paragraphs.clear();
    let index = 0;
    for(const [id, paragraph] of paragraphMapCopy) {
      if(index === paragraphWithIndex.index){
        this._paragraphs.set(paragraphWithIndex.paragraph.id(), paragraphWithIndex.paragraph);
      }
      else{
        this._paragraphs.set(id, paragraph);
      }
      index +=1;
    }
  }

  paragraphs():Map<string, Paragraph> {
    return this._paragraphs;
  }

  request(data: object): void {
    this._channel.request(data);
  }

  response(data: object): void {
    this._responseChannel.response(data);
    this._paragraphs.forEach(paragraph => paragraph.response(data));
  }

  isStub(): boolean {
    return false;
  }
}
