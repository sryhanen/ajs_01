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
import {Paragraph} from '../../../objects/paragraph/paragraph';
import {ParagraphImpl} from '../../../objects/paragraph/paragraphImpl';
import {FakeChannel} from '../../../objects/channel/fakeChannel';
import {Channel} from '../../../objects/channel/channel';
import {AngularObjectCollection} from '../../../objects/angularObjectCollection/angularObjectCollection';
import {AngularObjectCollectionImpl} from '../../../objects/angularObjectCollection/angularObjectCollectionImpl';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ParagraphView} from './paragraphView';
import {By} from '@angular/platform-browser';
import {OutputContainerView} from '../output/container/outputContainerView';
import {ToasterService} from '../../../shared/components/Toaster/notifications.service';
import {FakeToasterService} from '../../../shared/components/Toaster/fakeToasterService';

describe('ParagraphView integration', () => {
  const paragraphId = 'paragraphId';
  const channel:Channel = new FakeChannel();
  const angularObjectCollection:AngularObjectCollection = new AngularObjectCollectionImpl(channel);
  const toaster = new FakeToasterService();
  let paragraph:Paragraph;
  let fixture: ComponentFixture<ParagraphView>;

  beforeEach(async () => {
    paragraph = new ParagraphImpl(channel, {id:paragraphId}, angularObjectCollection);
    TestBed.configureTestingModule({
      providers: [
        {provide:ToasterService, useValue: toaster}
      ]
    });
    fixture = TestBed.createComponent(ParagraphView);
    fixture.componentInstance.paragraphId = 'paragraphId';
    fixture.componentInstance.paragraph = paragraph;
    fixture.detectChanges();
  });

  describe('Birth', () => {
    it('Should be initialized', () => {
      expect(fixture.componentInstance).toBeDefined();
    });

    it('Should have output container', () => {
      const outputContainer = fixture.debugElement.query(By.directive(OutputContainerView));
      expect(outputContainer).toBeTruthy();
    });

    it('Should have no output container if paragraphId does not match', () => {
      fixture.componentRef.setInput('paragraphId', 'wrongId');
      fixture.detectChanges();
      const outputContainer = fixture.debugElement.query(By.directive(OutputContainerView));
      expect(outputContainer).not.toBeTruthy();
    });
  });
});
