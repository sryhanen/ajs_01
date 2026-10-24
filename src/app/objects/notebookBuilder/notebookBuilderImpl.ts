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
import {NotebookBuilder} from './notebookBuilder';
import {Requestable} from '../channel/requestable';
import {Notebook} from '../notebook/notebook';
import {WebSocketPayload} from '../webSocket/webSocketPayload/webSocketPayload';
import {Paragraph} from '../paragraph/paragraph';
import {WebSocketPayloadImpl} from '../webSocket/webSocketPayload/webSocketPayloadImpl';
import {NotebookBehaviorImpl} from '../notebook/behavior/notebookBehaviorImpl';
import {RequestableNotebook} from '../notebook/channel/requestableNotebook';
import {computed, signal, WritableSignal} from '@angular/core';
import {ParagraphCollectionBehaviorImpl} from '../paragraphCollection/behavior/paragraphCollectionBehaviorImpl';
import {RequestableParagraphCollection} from '../paragraphCollection/channel/requestableParagraphCollection';
import {RespondableParagraphCollection} from '../paragraphCollection/channel/respondableParagraphCollection';
import {PrintableParagraphCollection} from '../paragraphCollection/printable/printableParagraphCollection';
import {ParagraphCollectionImpl} from '../paragraphCollection/paragraphCollectionImpl';
import {RespondableNotebook} from '../notebook/channel/respondableNotebook';
import {PrintableNotebook} from '../notebook/printable/printableNotebook';
import {NotebookImpl} from '../notebook/notebookImpl';
import {ParagraphBuilder} from '../paragraphBuilder/paragraphBuilder';
import {ParagraphBuilderImpl} from '../paragraphBuilder/paragraphBuilderImpl';
import {ParagraphCollection} from '../paragraphCollection/paragraphCollection';

export class NotebookBuilderImpl implements NotebookBuilder {
  private readonly _paragraphBuilder: ParagraphBuilder;

  constructor(paragraphBuilder: ParagraphBuilder) {
    this._paragraphBuilder = paragraphBuilder;
  }

  notebook(notebookState: WebSocketPayload, requestable: Requestable): Notebook {
    const notebookBehavior = new NotebookBehaviorImpl(notebookState);
    const notebookId = notebookState.stringProperty('id');
    const requestableNotebook = new RequestableNotebook(requestable, notebookId);
    const paragraphCollection = this.initializedParagraphCollection(requestableNotebook, notebookState);
    const respondableNotebook = new RespondableNotebook(paragraphCollection, notebookId);
    const printableNotebook = new PrintableNotebook(paragraphCollection);
    return new NotebookImpl(notebookBehavior,printableNotebook, respondableNotebook, requestableNotebook);
  }

  private initializedParagraphCollection(requestable:Requestable, notebookState:WebSocketPayload):ParagraphCollection {
    const paragraphs: WritableSignal<Map<string, Paragraph>> = signal(new Map());
    const paragraphCollectionBehavior = new ParagraphCollectionBehaviorImpl(paragraphs);
    const requestableParagraphCollection = new RequestableParagraphCollection(requestable, paragraphs);
    const respondables = computed(() => Array.from(paragraphs().values()));
    const paragraphBuilder = new ParagraphBuilderImpl();
    const respondableParagraphCollection = new RespondableParagraphCollection(paragraphCollectionBehavior, respondables, requestableParagraphCollection, paragraphBuilder);
    const printableParagraphCollection = new PrintableParagraphCollection(paragraphs);
    const paragraphCollection = new ParagraphCollectionImpl(paragraphCollectionBehavior, requestableParagraphCollection, respondableParagraphCollection, printableParagraphCollection);
    paragraphs.set(this.initializedParagraphs(notebookState.arrayProperty('paragraphs'), requestableParagraphCollection));
    return paragraphCollection;
  }

  private initializedParagraphs(paragraphs: object[], requestable:Requestable): Map<string,  Paragraph> {
    const paragraphMap = new Map<string, Paragraph>();
    paragraphs.forEach(paragraphData => {
      const paragraphState = new WebSocketPayloadImpl(paragraphData);
      const paragraph = this._paragraphBuilder.paragraph(paragraphState, requestable);
      paragraphMap.set(paragraph.id(), paragraph);
    });
    return paragraphMap;
  }
}
