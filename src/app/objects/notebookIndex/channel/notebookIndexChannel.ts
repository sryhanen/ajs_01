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
import {Channel} from '../../channel/channel';
import {WebSocketResponseImpl} from '../../webSocket/response/webSocketResponseImpl';
import {WebSocketPayloadImpl} from '../../webSocket/webSocketPayload/webSocketPayloadImpl';
import {Requestable} from '../../channel/requestable';
import {WebSocketResponse} from '../../webSocket/response/webSocketResponse';
import {TypedWebSocketResponse} from '../../webSocket/response/typedWebSocketResponse/typedWebSocketResponse';
import {NotebookImpl} from '../../notebook/notebookImpl';
import {computed, signal, Signal, WritableSignal} from '@angular/core';
import {Notebook} from '../../notebook/notebook';
import {NotebookIndexBehavior} from '../behavior/notebookIndexBehavior';
import {NotebookBehaviorImpl} from '../../notebook/behavior/notebookBehaviorImpl';
import {ParagraphCollectionImpl} from '../../paragraphCollection/paragraphCollectionImpl';
import {PrintableNotebook} from '../../notebook/printable/printableNotebook';
import {RequestableNotebook} from '../../notebook/channel/requestableNotebook';
import {RespondableNotebook} from '../../notebook/channel/respondableNotebook';
import {ParagraphCollectionBehaviorImpl} from '../../paragraphCollection/behavior/paragraphCollectionBehaviorImpl';
import {Paragraph} from '../../paragraph/paragraph';
import {RequestableParagraphCollection} from '../../paragraphCollection/channel/requestableParagraphCollection';
import {RespondableParagraphCollection} from '../../paragraphCollection/channel/respondableParagraphCollection';
import {ParagraphImpl} from '../../paragraph/paragraphImpl';
import {PrintableParagraphCollection} from '../../paragraphCollection/printable/printableParagraphCollection';
import {ParagraphBehaviorImpl} from '../../paragraph/behavior/paragraphBehaviorImpl';
import {RequestableParagraph} from '../../paragraph/channel/requestableParagraph';
import {RespondableParagraph} from '../../paragraph/channel/respondableParagraph';
import {Output} from '../../output/output';
import {OutputImpl} from '../../output/outputImpl';
import {WebSocketPayload} from '../../webSocket/webSocketPayload/webSocketPayload';
import {PrintableParagraph} from '../../paragraph/printable/printableParagraph';

export class NotebookIndexChannel implements Channel {
  private readonly _requestable: Requestable;
  private readonly _openedNotebook: Signal<Notebook>;
  private readonly _notebookIndexBehavior: NotebookIndexBehavior;

  constructor(requestable: Requestable, openedNotebook: Signal<Notebook>, notebookIndexBehavior:NotebookIndexBehavior) {
    this._requestable = requestable;
    this._openedNotebook = openedNotebook;
    this._notebookIndexBehavior = notebookIndexBehavior;
  }

  request(json: object): void {
    this._requestable.request(json);
  }

  response(json: object): void {
    const webSocketResponse = new WebSocketResponseImpl(new WebSocketPayloadImpl(json));
    if(webSocketResponse.operation() === 'NOTE'){
      this.handleNoteResponseEvent(webSocketResponse);
    }
    else if(!this._openedNotebook().isStub()){
      this._openedNotebook().response(json);
    }
  }

  private handleNoteResponseEvent(webSocketResponse: WebSocketResponse): void {
    const noteResponse = new TypedWebSocketResponse('NOTE', webSocketResponse);
    const receivedNotebookId = noteResponse.dataAsWebSocketPayload().stringProperty('id');
    if(receivedNotebookId === this._notebookIndexBehavior.id()){
      const notebookState = noteResponse.dataAsWebSocketPayload();
      const notebookBehavior = new NotebookBehaviorImpl(notebookState);
      const notebookParagraphs = notebookState.arrayProperty<object>('paragraphs');
      const notebookId = notebookState.stringProperty('id');
      const requestableNotebook = new RequestableNotebook(this, notebookId);
      const paragraphs: WritableSignal<Map<string, Paragraph>> = signal(new Map());
      const paragraphCollectionBehavior = new ParagraphCollectionBehaviorImpl(paragraphs);
      const requestableParagraphCollection = new RequestableParagraphCollection(requestableNotebook, paragraphs);
      const respondableParagraphCollection = new RespondableParagraphCollection(paragraphCollectionBehavior, computed(() => Array.from(paragraphs().values())), requestableParagraphCollection);
      const printableParagraphCollection = new PrintableParagraphCollection(paragraphs);
      const paragraphCollection = new ParagraphCollectionImpl(paragraphCollectionBehavior, requestableParagraphCollection, respondableParagraphCollection, printableParagraphCollection);
      paragraphs.set(this.initializedParagraphs(notebookParagraphs,requestableParagraphCollection));
      const respondableNotebook = new RespondableNotebook(paragraphCollection, notebookId);
      const printableNotebook = new PrintableNotebook(paragraphCollection);
      const notebook = new NotebookImpl(notebookBehavior,printableNotebook, respondableNotebook, requestableNotebook);
      this._notebookIndexBehavior.open(notebook);
    }
  }

  private initializedParagraphs(paragraphs: object[], requestable:Requestable): Map<string,  Paragraph> {
    const paragraphMap = new Map<string, Paragraph>();
    paragraphs.forEach(paragraphData => {
      const paragraphBehavior = new ParagraphBehaviorImpl(requestable, new WebSocketPayloadImpl(paragraphData));
      const paragraphId = paragraphBehavior.id();
      const requestableParagraph = new RequestableParagraph(requestable, paragraphId);
      const paragraphOutput = this.initializedOutput(new WebSocketPayloadImpl(paragraphData), requestableParagraph);
      const respondableParagraph = new RespondableParagraph(paragraphOutput, paragraphId);
      const printableParagraph = new PrintableParagraph(paragraphOutput, paragraphId);
      const paragraph = new ParagraphImpl(paragraphBehavior, requestableParagraph, respondableParagraph, printableParagraph);
      paragraphMap.set(paragraph.id(), paragraph);
    });
    return paragraphMap;
  }

  private initializedOutput(paragraphData: WebSocketPayload, requestable:Requestable): Output {
    const output = new OutputImpl(requestable);
    this.createOutputResponseIfOutputExists(paragraphData, output);
    return output;
  }

  private createOutputResponseIfOutputExists(paragraphData: WebSocketPayload, output:Output):void{
    if (paragraphData.propertyExists('output')) {
      const paragraphOutput = paragraphData.objectProperty('output');
      if (paragraphOutput['data'] === undefined || paragraphOutput['type'] === undefined) {
        console.error(`Output data not processed, format invalid: ${JSON.stringify(paragraphOutput)}`);
      } else {
        const paragraphOutputResponse = {
          op: 'PARAGRAPH_OUTPUT',
          data: {
            noteId: '',
            paragraphId: paragraphData.stringProperty('id'),
            output: paragraphOutput,
          }
        };
        output.response(paragraphOutputResponse);
      }
    }
  }
}
