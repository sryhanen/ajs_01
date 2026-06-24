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
import {Response} from '../channel/response';
import {Request} from '../channel/request';
import {ParagraphResponse} from './responses/paragraph/paragraphResponse';
import {ParagraphAddedResponse} from './responses/paragraphAdded/paragraphAddedResponse';
import {ParagraphRemovedResponse} from './responses/paragraphRemoved/paragraphRemovedResponse';
import {DefaultRequest} from './requests/default/defaultRequest';
import {RunParagraphRequest} from './requests/runParagraph/runParagraphRequest';
import {ParagraphCollection} from './paragraphCollection';
import {ParagraphImpl} from '../paragraph/paragraphImpl';
import {computed, signal, Signal, WritableSignal} from '@angular/core';
import { RenderNode } from '../rendering/renderNode/renderNode';
import {ComponentView} from '../rendering/componentView/componentView';
import {ComponentViewStub} from '../rendering/componentView/componentViewStub';

export class ParagraphCollectionImpl implements ParagraphCollection {
  private readonly _paragraphs: WritableSignal<Map<string,  Paragraph>>;
  private readonly _decoratorParagraphs:WritableSignal<Map<string,  object>>;
  private readonly _responses: Response[];
  private readonly _requests: Request[];
  private readonly _componentView: ComponentView;

  constructor(channel: Channel, initialParagraphData: object[]) {
    this._paragraphs = this.initializedParagraphs(initialParagraphData);
    this._responses = [
      new ParagraphResponse(channel, this._paragraphs, this._decoratorParagraphs),
      new ParagraphAddedResponse(channel, this._paragraphs, this._decoratorParagraphs),
      new ParagraphRemovedResponse(this._paragraphs, this._decoratorParagraphs),
    ];
    this._requests = [
      new DefaultRequest(channel),
      new RunParagraphRequest(channel, this._decoratorParagraphs)
    ];
    this._componentView = new ComponentViewStub();
  }

  private initializedParagraphs(initialParagraphData: object[]): WritableSignal<Map<string,  Paragraph>> {
    const paragraphMap = new Map<string, Paragraph>();
    initialParagraphData.forEach(paragraphData => {
      const paragraph = new ParagraphImpl(this, paragraphData);
      paragraphMap.set(paragraph.id(), paragraph);
    });
    return signal(paragraphMap);
  }

  print(): Signal<RenderNode> {
    return computed(() => ({
      componentView: this._componentView,
      children: computed(() => {
        const children:RenderNode[] = [];
        this._paragraphs().forEach(paragraph => {
          children.push(paragraph.print()());
        });
        return children;
      }),
    }));
  }

  request(data: object): void {
    this._requests.forEach(request => request.request(data));
  }

  response(data: object): void {
    this._responses.forEach(response => response.response(data));
    this._paragraphs().forEach(paragraph => paragraph.response(data));
  }
}
