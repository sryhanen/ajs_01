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
import {ComponentFixture} from '@angular/core/testing';
import {ParagraphPositionSelect} from './paragraphPositionSelect';
import {fireEvent, render, RenderResult, screen} from '@testing-library/angular';
import {Requestable} from '../../../../../../objects/channel/requestable';
import {FakeChannel} from '../../../../../../objects/channel/fakeChannel';

describe('Paragraph position select integration test', () => {
  let fixture:ComponentFixture<ParagraphPositionSelect>;
  let renderResult: RenderResult<ParagraphPositionSelect, ParagraphPositionSelect>;
  let requestable: Requestable;
  const lastParagraphIndex = 3;
  let paragraphData = {
    id:'paragraphId',
    index:0,
    lastParagraphIndex:lastParagraphIndex,
  };
  const topPosition = 'top';

  beforeEach(async () => {
    requestable = new FakeChannel();
    paragraphData = {
      id:'paragraphId',
      index:0,
      lastParagraphIndex:3,
    };
    renderResult = await render(ParagraphPositionSelect, {
      inputs:{
        paragraphData: paragraphData,
        requestable:requestable,
        position: topPosition
      }
    });

    fixture = renderResult.fixture;
  });

  describe('Birth', () => {
    it('Should have been initialized', () => {
      expect(fixture.componentInstance).toBeDefined();
      expect(screen.getByRole('button')).toBeDefined();
    });
  });

  describe('Position arguments', () => {
    describe('Top position', () => {
      it('Should have expected elements rendered', () => {
        expect(screen.getByText('Move to the top')).toBeDefined();
        expect(screen.getByRole('img')).toHaveClass('fa-angle-double-up');
      });
    });

    describe('Above position', () => {
      it('Should have expected elements rendered', () => {
        fixture.componentRef.setInput('position','above');
        fixture.detectChanges();
        expect(screen.getByText('Move up')).toBeDefined();
        expect(screen.getByRole('img')).toHaveClass('fa-angle-up');
      });
    });

    describe('Below position', () => {
      it('Should have expected elements rendered', () => {
        fixture.componentRef.setInput('position','below');
        fixture.detectChanges();
        expect(screen.getByText('Move down')).toBeDefined();
        expect(screen.getByRole('img')).toHaveClass('fa-angle-down');
      });
    });

    describe('Bottom position', () => {
      it('Should have expected elements rendered', () => {
        fixture.componentRef.setInput('position','bottom');
        fixture.detectChanges();
        expect(screen.getByText('Move to the bottom')).toBeDefined();
        expect(screen.getByRole('img')).toHaveClass('fa-angle-double-down');
      });
    });
  });

  describe('MoveParagraph position requests', () => {
    let spy;
    beforeEach(() => {
      spy = vi.spyOn(requestable, 'request');
    });

    it('Move position to top', () => {
      fireEvent.click(screen.getByRole('button'));
      const expectedRequest = {
        op:'MOVE_PARAGRAPH',
        data:{
          id: paragraphData.id,
          index:0,
        }
      };
      expect(spy).toHaveBeenCalledExactlyOnceWith(expectedRequest);
    });

    it('Move position to bottom', () => {
      fixture.componentRef.setInput('position','bottom');
      fixture.detectChanges();
      fireEvent.click(screen.getByRole('button'));
      const expectedRequest = {
        op:'MOVE_PARAGRAPH',
        data:{
          id: paragraphData.id,
          index:lastParagraphIndex,
        }
      };
      expect(spy).toHaveBeenCalledExactlyOnceWith(expectedRequest);
    });

    describe('Move position to above', () => {
      it('Position move when current index is 0', () => {
        fixture.componentRef.setInput('position','above');
        fixture.detectChanges();
        fireEvent.click(screen.getByRole('button'));
        const expectedRequest = {
          op:'MOVE_PARAGRAPH',
          data:{
            id: paragraphData.id,
            index:0,
          }
        };
        expect(spy).toHaveBeenCalledExactlyOnceWith(expectedRequest);
      });
      it('Position move when current index is 2', () => {
        paragraphData.index = 2;
        fixture.componentRef.setInput('position','above');
        fixture.componentRef.setInput('paragraphData',paragraphData);
        fixture.detectChanges();
        fireEvent.click(screen.getByRole('button'));
        const expectedRequest = {
          op:'MOVE_PARAGRAPH',
          data:{
            id: paragraphData.id,
            index:1,
          }
        };
        expect(spy).toHaveBeenCalledExactlyOnceWith(expectedRequest);
      });
    });

    describe('Move position to below', () => {
      it('Position move when current index is 0', () => {
        fixture.componentRef.setInput('position','below');
        fixture.detectChanges();
        fireEvent.click(screen.getByRole('button'));
        const expectedRequest = {
          op:'MOVE_PARAGRAPH',
          data:{
            id: paragraphData.id,
            index:1,
          }
        };
        expect(spy).toHaveBeenCalledExactlyOnceWith(expectedRequest);
      });

      it('Position move when current index is last index', () => {
        paragraphData.index = 3;
        fixture.componentRef.setInput('position','below');
        fixture.componentRef.setInput('paragraphData',paragraphData);
        fixture.detectChanges();
        fireEvent.click(screen.getByRole('button'));
        const expectedRequest = {
          op:'MOVE_PARAGRAPH',
          data:{
            id: paragraphData.id,
            index:3,
          }
        };
        expect(spy).toHaveBeenCalledExactlyOnceWith(expectedRequest);
      });
    });
  });
});
