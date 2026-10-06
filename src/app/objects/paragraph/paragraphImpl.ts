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
import {Paragraph} from './paragraph';
import {Channel} from '../channel/channel';
import {WebSocketPayload} from '../webSocketPayload/webSocketPayload';
import {WebSocketPayloadImpl} from '../webSocketPayload/webSocketPayloadImpl';
import {signal, Signal} from '@angular/core';
import { RenderNode } from '../rendering/renderNode/renderNode';
import {RenderNodeImpl} from '../rendering/renderNode/renderNodeImpl';
import {RegisteredComponents} from '../../ui/angular2+/componentRegistry/registeredComponents';
import {Output} from '../output/output';
import {OutputImpl} from '../output/outputImpl';
import {MessagePropertyEqualsFilter} from '../message/messageFilter/messagePropertyEqualsFilter';
import {MessageImpl} from '../message/messageImpl';
import {PropertyDecoratedMessage} from '../message/propertyDecoratedMessage/propertyDecoratedMessage';
import {Message} from '../message/message';
import {Editor} from '../editor/editor';
import {EditorImpl} from '../editor/editorImpl';

export class ParagraphImpl implements Paragraph {
  private readonly _channel: Channel;
  private readonly _output: Output;
  private readonly _editor:Editor;
  private readonly _paragraphData: WebSocketPayload;
  private readonly _renderNode: Signal<RenderNode>;
  private readonly _paragraphIdFilter: MessagePropertyEqualsFilter;
  private readonly _requestEvents: Map<string, (message:Message) => void>;

  constructor(channel: Channel, paragraph: object) {
    this._channel = channel;
    this._paragraphData = new WebSocketPayloadImpl(paragraph);
    this._output = new OutputImpl(this);
    this._editor = new EditorImpl(this);
    this.initializeOutput(this._paragraphData, this._output);
    this._renderNode = signal(new RenderNodeImpl(RegisteredComponents.PARAGRAPH_VIEW, signal({
      output:this._output.print()(),
      editor:this._editor.print()(),
      paragraphId:this.id()
    })));
    this._paragraphIdFilter = new MessagePropertyEqualsFilter('paragraphId', this.id());
    this._requestEvents = new Map([
      ['RUN_PARAGRAPH', (message) => this.runParagraphRequest(message)],
      ['COMMIT_PARAGRAPH', (message) => this.commitParagraphRequest(message)],
    ]);
  }

  private initializeOutput(paragraphData: WebSocketPayload, output:Output):void{
    if(paragraphData.propertyExists('output')){
      const outputAsPayload = paragraphData.objectPropertyAsPayload('output');
      const outputData = paragraphData.objectProperty('output');
      if(!outputAsPayload.propertyExists('data') || !outputAsPayload.propertyExists('type')){
        console.error(`Output data not processed, format invalid: ${JSON.stringify(outputData)}`);
      }
      else{
        const paragraphOutputMessageData = {
          op: 'PARAGRAPH_OUTPUT',
          data: {
            noteId: '',
            paragraphId: '',
            output:outputData,
          }
        };
        output.response(paragraphOutputMessageData);
      }
    }
  }

  print(): Signal<RenderNode> {
    return this._renderNode;
  }

  id(): string {
    return this._paragraphData.stringProperty('id');
  }

  request(json: object): void {
    const message = new MessageImpl(new WebSocketPayloadImpl(json));
    if(message.operation() === 'RUN_PARAGRAPH'){
      this.runParagraphRequest(message);
    }
    else{
      const paragraphIdDecoratedMessage = new PropertyDecoratedMessage(message, 'paragraphId', this.id());
      this._channel.request({
        op:paragraphIdDecoratedMessage.operation(),
        data:paragraphIdDecoratedMessage.data()
      });
    }
  }

  response(json: object): void {
    const message = new MessageImpl(new WebSocketPayloadImpl(json));
    const filteredMessage = this._paragraphIdFilter.filteredMessage(message);
    if(!filteredMessage.isStub()) {
      const message = {
        op:filteredMessage.operation(),
        data:filteredMessage.data()
      };
      this._output.response(message);
      this._editor.response(message);
    }
  }

  private runParagraphRequest(message:Message):void{
    const paragraphId = message.dataAsWebSocketPayload().stringProperty('id');
    if(paragraphId !== this.id()){
      throw new RangeError(`Wrong paragraphId "${paragraphId} given`);
    }
    const runParagraphRequest = {
      op:'RUN_PARAGRAPH',
      data: {
        id: this.id(),
        paragraph: this._paragraphData.stringProperty('text'),
        config: this._paragraphData.objectProperty('config'),
        params: this._paragraphData.objectPropertyAsPayload('settings').objectProperty('params'),
      },
    };
    this._channel.request(runParagraphRequest);
  }

  private commitParagraphRequest(message:Message):void{
   // const commitParagraphRequest = {
   //   op:'COMMIT_PARAGRAPH',
   //   data:{
   //     id: '',
   //     noteId: '',
   //     title: '',
   //     paragraph: editor.getValue(),
   //     config: '',
   //     params: '',
   //   }
   // };

  }
}
