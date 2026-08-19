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
import {fireEvent, render, screen} from '@testing-library/angular';
import {Requestable} from '../../../../../../objects/channel/requestable';
import {FakeChannel} from '../../../../../../objects/channel/fakeChannel';

describe('Paragraph position select integration test', () => {
  let fixture:ComponentFixture<ParagraphPositionSelect>;
  let requestable: Requestable;
  const paragraphId = 'paragraphId';
  const initialPosition = 'top';

  beforeEach(async () => {
    requestable = new FakeChannel();
    const renderResult = await render(ParagraphPositionSelect, {
      inputs:{
        paragraphId:paragraphId,
        requestable:requestable,
        position: initialPosition
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
    let spy;
    let expectedRequest = {
      op:'CHANGE_PARAGRAPH_POSITION',
      data:{
        position:'',
        paragraphId:paragraphId,
      }
    };
    beforeEach(() => {
      expectedRequest = {
        op:'CHANGE_PARAGRAPH_POSITION',
        data:{
          position:initialPosition,
          paragraphId:paragraphId,
        }
      };
      spy = vi.spyOn(requestable, 'request');
    });

    describe('Top', () => {
      it('Should have matching text for the given position', () => {
        expect(screen.getByText('Move to the top')).toBeDefined();
      });

      it('Should have matching class for the given position', () => {
        expect(screen.getByRole('img')).toHaveClass('fa-angle-double-up');
      });

      it('Should send request when clicking button', () => {
        fireEvent.click(screen.getByRole('button'));
        expect(spy).toHaveBeenCalledExactlyOnceWith(expectedRequest);
      });
    });

    describe('Above', () => {
      beforeEach(() => {
        fixture.componentRef.setInput('position','above');
        fixture.detectChanges();
      });

      it('Should have matching text for the given position', () => {
        expect(screen.getByText('Move up')).toBeDefined();
      });

      it('Should have matching class for the given position', () => {
        expect(screen.getByRole('img')).toHaveClass('fa-angle-up');
      });

      it('Should send request when clicking button', () => {
        fireEvent.click(screen.getByRole('button'));
        expectedRequest.data.position = 'above';
        expect(spy).toHaveBeenCalledExactlyOnceWith(expectedRequest);
      });

      describe('Below', () => {
        beforeEach(() => {
          fixture.componentRef.setInput('position','below');
          fixture.detectChanges();
        });

        it('Should have matching text for the given position', () => {
          expect(screen.getByText('Move down')).toBeDefined();
        });

        it('Should have matching class for the given position', () => {
          expect(screen.getByRole('img')).toHaveClass('fa-angle-down');
        });

        it('Should send request when clicking button', () => {
          fireEvent.click(screen.getByRole('button'));
          expectedRequest.data.position = 'below';
          expect(spy).toHaveBeenCalledExactlyOnceWith(expectedRequest);
        });
      });

      describe('Bottom', () => {
        beforeEach(() => {
          fixture.componentRef.setInput('position','bottom');
          fixture.detectChanges();
        });

        it('Should have matching text for the given position', () => {
          expect(screen.getByText('Move to the bottom')).toBeDefined();
        });

        it('Should have matching class for the given position', () => {
          expect(screen.getByRole('img')).toHaveClass('fa-angle-double-down');
        });

        it('Should send request when clicking button', () => {
          fireEvent.click(screen.getByRole('button'));
          expectedRequest.data.position = 'bottom';
          expect(spy).toHaveBeenCalledExactlyOnceWith(expectedRequest);
        });
      });
    });
  });
});
