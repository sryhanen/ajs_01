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
import {Notebook} from './notebook';
import {Channel} from '../channel/channel';
import {Paragraph} from '../paragraph/paragraph';
import {PushValue} from '../pushValue/pushValue';
import {AngularObjectCollection} from '../angularObjectCollection/angularObjectCollection';
import {AngularObjectCollectionImpl} from '../angularObjectCollection/angularObjectCollectionImpl';
import {SafeJsonImpl} from '../safeJson/safeJsonImpl';
import {SafeJson} from '../safeJson/safeJson';
import {MessageImpl} from '../message/messageImpl';
import {ParagraphCollectionImpl} from '../paragraphCollection/paragraphCollectionImpl';
import {ParagraphCollection} from '../paragraphCollection/paragraphCollection';
import {ParagraphImpl} from '../paragraph/paragraphImpl';

export class NotebookImpl implements Notebook {
  private readonly _channel: Channel;
  private readonly _notebook: SafeJson;
  private readonly _angularObjectCollection: AngularObjectCollection;
  private readonly _paragraphCollection: ParagraphCollection;

  constructor(channel: Channel, notebook: object) {
    this._channel = channel;
    this._notebook = new SafeJsonImpl(notebook);
    this._angularObjectCollection = new AngularObjectCollectionImpl(this);
    this._paragraphCollection = new ParagraphCollectionImpl(this, this.initialParagraphs(), this._angularObjectCollection);
  }

  private initialParagraphs(): Paragraph[] {
    const paragraphs: Paragraph[] = [];
    if(this._notebook.propertyExists('paragraphs')) {
      const paragraphDataListing:Array<object> = this._notebook.getProperty('paragraphs', 'object');
      for (const paragraphData of paragraphDataListing) {
        paragraphs.push(new ParagraphImpl(this, paragraphData, this._angularObjectCollection));
      }
    }
    return paragraphs;
  }

  paragraphs(value:PushValue<Paragraph[]>): void {
    this._paragraphCollection.paragraphs(value);
  }

  id(): string {
    return this._notebook.getProperty('id', 'string');
  }

  request(data: object): void {
    const message = new MessageImpl(new SafeJsonImpl(data));
    const messageData = new SafeJsonImpl(message.data());
    if(messageData.propertyExists('noteId')){
      const decoratedData = message.data();
      decoratedData['noteId'] = this.id();
      const decoratedRequest = {
        op:message,
        data:decoratedData,
      };
      this._channel.request(decoratedRequest);
    }
    else{
      this._channel.request(data);
    }
  }

  response(data: object): void {
    const message = new MessageImpl(new SafeJsonImpl(data));
    const messageData = new SafeJsonImpl(message.data());
    if(messageData.propertyExists('noteId')){
      if(messageData.getProperty('noteId', 'string') === this.id()){
        this.respondChildren(data);
      }
    }
    else{
      this.respondChildren(data);
    }
  }

  private respondChildren(data:object): void {
    this._paragraphCollection.response(data);
    this._angularObjectCollection.response(data);
  }
}
