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
import {ParagraphCollection} from '../../../objects/paragraphCollection/paragraphCollection';
import {Paragraph} from '../../../objects/paragraph/paragraph';
import {signal, WritableSignal} from '@angular/core';
import {ParagraphAngularImpl} from '../paragraph/paragraphAngularImpl';

export class ParagraphCollectionAngularImpl implements ParagraphCollection {
  private readonly _paragraphCollection: ParagraphCollection;
  private readonly _paragraphs: WritableSignal<Map<string, Paragraph>>;

  constructor(paragraphCollection: ParagraphCollection) {
    this._paragraphCollection = paragraphCollection;
    this._paragraphs = signal(this.paragraphMapMappedToParagraphAngularMap());
  }

  private paragraphMapMappedToParagraphAngularMap(): Map<string, Paragraph> {
    const paragraphs = this._paragraphCollection.paragraphs();
    const newParagraphMap = new Map<string, Paragraph>();
    for (const [id, paragraph] of paragraphs) {
      newParagraphMap.set(id, new ParagraphAngularImpl(paragraph));
    }
    return newParagraphMap;
  }

  request(data: object): void {
    this._paragraphCollection.request(data);
  }

  response(data: object): void {
    if(this._paragraphs().size !== this._paragraphCollection.paragraphs().size) {
      this._paragraphs.set(this.paragraphMapMappedToParagraphAngularMap());
    }
    this._paragraphs().forEach(paragraph => paragraph.response(data));
  }

  isStub(): boolean {
    return false;
  }

  paragraphs(): Map<string, Paragraph>{
    return this._paragraphs();
  }
}
