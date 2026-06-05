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
import {ParagraphCollectionImpl} from '../../../objects/paragraphCollection/paragraphCollectionImpl';
import {FakeChannel} from '../../../objects/channel/fakeChannel';
import {Channel} from '../../../objects/channel/channel';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ParagraphCollectionView} from './paragraphCollectionView';
import {By} from '@angular/platform-browser';
import {ParagraphViewFake} from '../paragraph/paragraphViewFake';

describe('ParagraphCollectionView integration', () => {
  const channel:Channel = new FakeChannel();
  const paraId1 = 'para1';
  let initialParagraphs: object[];
  let paragraphCollection: ParagraphCollection;

  let fixture: ComponentFixture<ParagraphCollectionView>;

  beforeEach(() => {
    initialParagraphs  = [
      {id:paraId1},
      {id:'para2'},
      {id:'para3'},
    ];
    paragraphCollection = new ParagraphCollectionImpl(channel, initialParagraphs);
    TestBed.overrideComponent(ParagraphCollectionView, {
      set: {
        imports: [ParagraphViewFake],
      },
    });
    fixture = TestBed.createComponent(ParagraphCollectionView);
    fixture.componentInstance.paragraphCollection = paragraphCollection;
    fixture.detectChanges();
  });

  describe('Birth', () => {
    it('Should be initialized', () => {
      expect(fixture.componentInstance).toBeDefined();
    });

    it('Should have paragraphs visible', () =>{
      const paragraphs = fixture.debugElement.queryAll(By.css('paragraph'));
      expect(paragraphs).toHaveLength(3);
    });

    it('Should not have paragraphs visible', () => {
      fixture.destroy();
      const emptyCollection = new ParagraphCollectionImpl(channel, []);
      fixture = TestBed.createComponent(ParagraphCollectionView);
      fixture.componentInstance.paragraphCollection = emptyCollection;
      fixture.detectChanges();
      const paragraphs = fixture.debugElement.queryAll(By.css('paragraph'));
      expect(paragraphs).toHaveLength(0);
    });
  });

  describe('Collection updates', () => {
    it('Should add paragraph', () => {
      const paragraphAddedResponse = {
        op:'PARAGRAPH_ADDED',
        data:{
          index:0,
          paragraph:{
            id:'newParagraph'
          }
        }
      };
      paragraphCollection.response(paragraphAddedResponse);
      fixture.detectChanges();
      const paragraphs = fixture.debugElement.queryAll(By.css('paragraph'));
      expect(paragraphs).toHaveLength(4);
    });

    it('Should remove paragraph', () => {
      const paragraphRemovedResponse = {
        op: 'PARAGRAPH_REMOVED',
        data: {
          id:paraId1
        }
      };
      paragraphCollection.response(paragraphRemovedResponse);
      fixture.detectChanges();
      const paragraphs = fixture.debugElement.queryAll(By.css('paragraph'));
      expect(paragraphs).toHaveLength(2);
    });
  });
});
