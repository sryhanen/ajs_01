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
import {Request} from '../channel/request';
import {OutputContainer} from '../output/container/outputContainer';
import {OutputContainerImpl} from '../output/container/outputContainerImpl';
import {SafeJsonImpl} from '../safeJson/safeJsonImpl';
import {MessageImpl} from '../message/messageImpl';
import {EditorImpl} from '../editor/editorImpl';
import {Editor} from '../editor/editor';
import {CommitParagraphRequest} from './requests/commitParagraph/commitParagraphRequest';
import {DefaultRequest} from './requests/default/defaultRequest';
import {ParagraphData} from './paragraphData/paragraphData';
import {ParagraphDataImpl} from './paragraphData/paragraphDataImpl';

export class ParagraphImpl implements Paragraph{
  private readonly _channel: Channel;
  private readonly _outputContainer: OutputContainer;
  private readonly _paragraphData: ParagraphData;
  private readonly _requests: Request[];
  private readonly _editor:EditorImpl;

  constructor(channel: Channel, paragraphData: object) {
    this._channel = channel;
    this._paragraphData = new ParagraphDataImpl(paragraphData);
    this._outputContainer = new OutputContainerImpl(this);
    this._editor = new EditorImpl(this, this._paragraphData);
    const paragraphDataOutput = this._paragraphData.output();
    if(!paragraphDataOutput.isStub()){
      const paragraphOutputMessage = {
        op:'PARAGRAPH_OUTPUT',
        data: {
          noteId:'',
          paragraphId:'',
          output: paragraphDataOutput.print(),
        }
      };
      this._outputContainer.response(paragraphOutputMessage);
    }
    this._requests = [
      new CommitParagraphRequest(this._channel, this._paragraphData),
      new DefaultRequest(this._channel)
    ];
  }

  paragraphData(): ParagraphData {
    return this._paragraphData;
  }

  outputContainer(): OutputContainer {
    return this._outputContainer;
  }

  editor(): Editor {
    return this._editor;
  }

  request(data: object): void {
    const message = new MessageImpl(new SafeJsonImpl(data));
    const messageData = new SafeJsonImpl(message.data());
    if(messageData.propertyExists('paragraphId')){
      const decoratedData = message.data();
      decoratedData['paragraphId'] = this._paragraphData.id();
      const decoratedRequest = {
        op:message.operation(),
        data:decoratedData,
      };
      this._requests.forEach(request => request.request(decoratedRequest));
    }
    else {
      this._requests.forEach(request => request.request(data));
    }
  }

  response(data: object): void {
    const message = new MessageImpl(new SafeJsonImpl(data));
    const messageData = new SafeJsonImpl(message.data());
    if(messageData.propertyExists('paragraphId')){
      const paragraphId:string = messageData.getProperty('paragraphId', 'string');
      if(paragraphId === this._paragraphData.id()){
        this._outputContainer.response(data);
        this._editor.response(data);
      }
    }
    else{
      this._outputContainer.response(data);
      this._editor.response(data);
    }
  }
}
