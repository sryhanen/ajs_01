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
import {NotebookDTO} from '../message/noteMessage/notebookDTO';
import {Channel} from '../channel/channel';
import {Paragraph} from '../paragraph/paragraph';
import {MessageDTO} from '../message/messageDTO';
import {NoteMessageImpl} from '../message/noteMessage/noteMessageImpl';
import {ParagraphOutputDTO} from '../message/paragraphOutputMessage/paragraphOutputDTO';
import {ParagraphOutputMessageImpl} from '../message/paragraphOutputMessage/paragraphOutputMessageImpl';
import {ParagraphOutputRequestDTO} from '../output/paragraphOutputRequest/paragraphOutputRequestDTO';
import {ParagraphDTO} from '../paragraph/paragraphDTO';
import {ParagraphImpl} from '../paragraph/paragraphImpl';
import {PushValue} from '../pushValue/pushValue';
import {AngularObjectCollection} from '../angularObjectCollection/angularObjectCollection';
import {AngularObjectCollectionImpl} from '../angularObjectCollection/angularObjectCollectionImpl';
import {AngularObjectUpdateMessageImpl} from '../message/angularObjectUpdateMessage/angularObjectUpdateMessageImpl';
import {AngularObjectUpdateDTO} from '../message/angularObjectUpdateMessage/angularObjectUpdateDTO';

export class NotebookImpl implements Notebook {
  private readonly _channel: Channel;
  private _notebook: Partial<NotebookDTO>;
  private _paragraphs: Paragraph[];
  private readonly _pushParagraphs: PushValue<Paragraph[]>[];
  private readonly _angularObjectCollection: AngularObjectCollection;

  constructor(channel: Channel, notebook: Partial<NotebookDTO>) {
    this._channel = channel;
    this._notebook = notebook;
    this._paragraphs = [];
    this._pushParagraphs = [];
    this._angularObjectCollection = new AngularObjectCollectionImpl(this);
  }

  paragraphs(value:PushValue<Paragraph[]>):void{
    value.update(this._paragraphs);
    this._pushParagraphs.push(value);
  }

  id(): string {
    return this._notebook.id;
  }

  request(data: object): void {
    let message = data as MessageDTO<unknown>;
    if(message.op === 'PARAGRAPH_OUTPUT_REQUEST') {
      const paragraphOutputRequestMessage = data as MessageDTO<ParagraphOutputRequestDTO>;
      paragraphOutputRequestMessage.data.noteId = this.id();
      message = paragraphOutputRequestMessage;
    }
    this._channel.request(message);
  }

  response(data: object): void {
    const message = data as MessageDTO<unknown>;
    const op = message.op;
    if(op === 'NOTE'){
      const noteMessage = new NoteMessageImpl(message.data as NotebookDTO);
      if(noteMessage.id() === this.id()){
        this._paragraphs = noteMessage.paragraphs(this, this._angularObjectCollection);
        this._pushParagraphs.forEach(value => value.update(this._paragraphs));
      }
    }
    else if(op === 'PARAGRAPH_ADDED'){
      const paragraphAddedMessage = message.data as {paragraph:ParagraphDTO, index:number};
      const paragraph = new ParagraphImpl(this, paragraphAddedMessage.paragraph, this._angularObjectCollection);
      this._paragraphs.splice(paragraphAddedMessage.index,0, paragraph);
      this._pushParagraphs.forEach(value => value.update(this._paragraphs));
    }
    else if(op === 'PARAGRAPH_REMOVED'){
      const paragraphRemovedMessage = message.data as {id:string};
      const index = this._paragraphs.findIndex(paragraph => paragraph.id() === paragraphRemovedMessage.id);
      this._paragraphs.splice(index, 1);
      this._pushParagraphs.forEach(value => value.update(this._paragraphs));
    }
    else if(op === 'PARAGRAPH_OUTPUT'){
      const paragraphOutputMessage = new ParagraphOutputMessageImpl(message.data as ParagraphOutputDTO);
      if(paragraphOutputMessage.noteId() === this.id()){
        this._paragraphs.forEach(paragraph => {
          paragraph.response(message);
        });
      }
    }
    else if(op === 'ANGULAR_OBJECT_UPDATE'){
      const angularObjectUpdateMessage = new AngularObjectUpdateMessageImpl(message.data as AngularObjectUpdateDTO);
      if(angularObjectUpdateMessage.noteId() === this.id()){
        this._angularObjectCollection.response(data);
      }
    }
    else {
      this._paragraphs.forEach(paragraph => {
        paragraph.response(data);
      });
    }
  }
}
