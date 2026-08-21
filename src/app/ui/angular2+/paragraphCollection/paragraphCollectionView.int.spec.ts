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
import {Requestable} from '../../../objects/channel/requestable';
import {FakeChannel} from '../../../objects/channel/fakeChannel';
import {ComponentViewImpl} from '../../../objects/rendering/componentView/componentViewImpl';
import {Component, signal} from '@angular/core';
import {ParagraphCollectionView} from './paragraphCollectionView';
import {By} from '@angular/platform-browser';
import {NewParagraphButton} from './newParagraphButton/newParagraphButton';
import {render} from '@testing-library/angular';
import {ComponentFixture} from '@angular/core/testing';

describe('ParagraphCollectionView', () => {
  let fixture: ComponentFixture<ParagraphCollectionView>;
  @Component({
    selector: 'paragraph',
    template: ''
  })
  class FakeParagraphComponent{}

  let requestable:Requestable;
  const paragraphs = [
    new ComponentViewImpl(FakeParagraphComponent, signal({paragraphData:{}})),
    new ComponentViewImpl(FakeParagraphComponent, signal({paragraphData:{}})),
    new ComponentViewImpl(FakeParagraphComponent, signal({paragraphData:{}}))
  ];

  beforeEach(async () => {
    requestable = new FakeChannel();
    const renderResult = await render(ParagraphCollectionView, {
      inputs:{
        requestable: requestable,
        paragraphs: paragraphs,
      }
    });
    fixture = renderResult.fixture;
  });

  describe('Birth', () => {
    it('Should have rendered component view', () => {
      expect(fixture.debugElement.queryAll(By.directive(NewParagraphButton))).toHaveLength(3);
      expect(fixture.debugElement.queryAll(By.directive(FakeParagraphComponent))).toHaveLength(3);
    });
  });
});
