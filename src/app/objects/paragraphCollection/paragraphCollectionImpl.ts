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
import {computed, signal, Signal, WritableSignal} from '@angular/core';
import { RenderNode } from '../rendering/renderNode/renderNode';
import {ParagraphMessageImpl} from '../message/paragraphMessage/paragraphMessageImpl';
import {WebSocketPayloadImpl} from '../webSocketPayload/webSocketPayloadImpl';
import {MessageImpl} from '../message/messageImpl';
import {ParagraphAddedMessageImpl} from '../message/paragraphAddedMessage/paragraphAddedMessageImpl';
import {ParagraphRemovedMessageImpl} from '../message/paragraphRemovedMessage/paragraphRemovedMessageImpl';
import {Message} from '../message/message';
import {RegisteredComponents} from '../../ui/angular2+/componentRegistry/registeredComponents';
import {RenderNodeImpl} from '../rendering/renderNode/renderNodeImpl';

export class ParagraphCollectionImpl implements ParagraphCollection {
  private readonly _channel: Channel;
  private readonly _paragraphs: WritableSignal<Map<string,  Paragraph>>;
  private readonly _renderNode: Signal<RenderNode>;
  private readonly _responseEvents:Map<string, (message:Message) => void>;

  constructor(channel: Channel, initialParagraphData: object[]) {
    this._channel = channel;
    this._paragraphs = this.initializedParagraphs(initialParagraphData);
    this._renderNode = signal(new RenderNodeImpl(RegisteredComponents.PARAGRAPH_COLLECTION_VIEW, computed(() => ({
      paragraphs: Array.from(this._paragraphs().values()).map(paragraph => paragraph.print()()),
    }))));
    this._responseEvents = new Map([
      ['PARAGRAPH', (message) => this.paragraphResponse(message)],
      ['PARAGRAPH_ADDED', (message) => this.paragraphAddedResponse(message)],
      ['PARAGRAPH_REMOVED', (message) => this.paragraphRemovedResponse(message)],
    ]);
  }

  updateParagraph(paragraph: Paragraph): void {
    const paragraphId = paragraph.id();
    if(!this._paragraphs().has(paragraphId)){
      throw new Error(`Paragraph with id "${paragraphId}" is not part of paragraph collection.`);
    }
    this._paragraphs.update(paragraphs => {
      paragraphs.set(paragraph.id(), paragraph);
      return paragraphs;
    });
  }

  addParagraph(paragraph: Paragraph, index:number): void {
    if(index < 0 || index > 0 && index > Array.from(this._paragraphs()).length - 1){
      throw new Error(` 1 Invalid index provided: ${index}.`);
    }
    const paragraphId = paragraph.id();
    if(this._paragraphs().has(paragraphId)){
      throw new Error(`Paragraph with id "${paragraphId}" already exists.`);
    }
    const paragraphsAsArray = Array.from(this._paragraphs().values());
    paragraphsAsArray.splice(index, 0, paragraph);
    this._paragraphs.set(new Map(paragraphsAsArray.map(paragraph => [paragraph.id(), paragraph])));
  }

  removeParagraph(paragraphId: string): void {
    if(!this._paragraphs().has(paragraphId)){
      throw new Error(`Paragraph with id "${paragraphId}" does not exists.`);
    }
    this._paragraphs.update(paragraphs => {
      paragraphs.delete(paragraphId);
      return paragraphs;
    });
  }

  private paragraphResponse(message:Message):void{
    const paragraphMessage = new ParagraphMessageImpl(message);
    paragraphMessage.updateParagraph(this);
  }

  private paragraphAddedResponse(message:Message):void{
    const paragraphAddedMessage = new ParagraphAddedMessageImpl(message);
    paragraphAddedMessage.addParagraph(this);
  }

  private paragraphRemovedResponse(message:Message):void{
    const paragraphRemovedMessage = new ParagraphRemovedMessageImpl(message);
    paragraphRemovedMessage.removeParagraph(this);
  }

  private initializedParagraphs(initialParagraphData: object[]): WritableSignal<Map<string,  Paragraph>> {
    const paragraphMap = new Map<string, Paragraph>();
    initialParagraphData.forEach(paragraphData => {
      const paragraph = new ParagraphImpl(this, paragraphData);
      paragraphMap.set(paragraph.id(), paragraph);
    });
    return signal(paragraphMap, {
      equal: () => false
    });
  }

  print(): Signal<RenderNode> {
    return this._renderNode;
  }

  request(json: object): void {
    const message = new MessageImpl(new WebSocketPayloadImpl(json));
    if(message.operation() === 'EXECUTE_PARAGRAPH') {
      this.executeParagraphRequest(message);
    }
    else{
      this._channel.request(json);
    }
  }

  private executeParagraphRequest(message:Message):void {
    const executableParagraphId = message.dataAsWebSocketPayload().stringProperty('paragraphId');
    const executableParagraph = this._paragraphs().get(executableParagraphId);
    executableParagraph.request({
      op:'RUN_PARAGRAPH',
      data:{
        id: executableParagraphId,
        paragraph: '',
        config: {},
        params: {}
      }
    });
  }

  response(json: object): void {
    const message = new MessageImpl(new WebSocketPayloadImpl(json));
    const eventName = message.operation();
    if(this._responseEvents.has(eventName)){
      const eventCallback = this._responseEvents.get(eventName);
      eventCallback(message);
    }
    else{
      this._paragraphs().forEach(paragraph => paragraph.response(json));
    }
  }
}
