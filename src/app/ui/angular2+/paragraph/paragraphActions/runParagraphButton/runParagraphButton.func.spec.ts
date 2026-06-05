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
import {fireEvent, render, screen} from '@testing-library/angular';
import {RunParagraphButton} from './runParagraphButton';
import {Paragraph} from '../../../../../objects/paragraph/paragraph';
import {ParagraphImpl} from '../../../../../objects/paragraph/paragraphImpl';
import {FakeChannel} from '../../../../../objects/channel/fakeChannel';
import {Channel} from '../../../../../objects/channel/channel';
import {ComponentFixture} from '@angular/core/testing';

describe('RunParagraphButton functional test', () => {
  let channel:Channel;
  let finishedParagraph:Paragraph;
  let runningParagraph:Paragraph;
  let paragraph:Paragraph;
  let fixture: ComponentFixture<RunParagraphButton>;

  beforeEach(async () => {
    channel = new FakeChannel();
    finishedParagraph = new ParagraphImpl(channel, {
      id:'paragraphId',
      text:'paragraphText',
      config:{},
      settings:{},
      status:'FINISHED'
    });
    runningParagraph  = new ParagraphImpl(channel, {
      id:'paragraphId',
      text:'paragraphText',
      config:{},
      settings:{},
      status:'RUNNING'
    });
    paragraph = finishedParagraph;
    const renderResult = await render(RunParagraphButton, {
      inputs:{
        paragraph: paragraph
      }
    });
    fixture = renderResult.fixture;
  });

  describe('Birth', () => {
    it('Should have initialized', () => {
      expect(fixture.componentInstance).toBeDefined();
    });
  });

  describe('Button visibility', () => {
    it('Should have button with title "Run this paragraph" visible', () => {
      const initialButton = screen.getByRole('button');
      expect(initialButton).toBeDefined();
      expect(initialButton.title).toEqual('Run this paragraph');
    });

    it('Should have button with title "Cancel paragraph run" visible', () => {
      paragraph = runningParagraph;
      fixture.componentRef.setInput('paragraph', paragraph);
      fixture.detectChanges();
      const initialButton = screen.getByRole('button');
      expect(initialButton).toBeDefined();
      expect(initialButton.title).toEqual('Cancel paragraph run');
    });
  });

  describe('Button user interaction', () => {
    let requestSpy;
    beforeEach(() => {
      requestSpy = vi.spyOn(channel, 'request');
    });

    it('Clicking button with title "Run this paragraph" should create request', () => {
      const expectedRequest = {
        op:'RUN_PARAGRAPH',
        data:{
          id: 'paragraphId',
          paragraph:'paragraphText',
          config:{},
          params:{}
        }
      };
      fireEvent.click(screen.getByRole('button'));
      expect(requestSpy).toHaveBeenCalledExactlyOnceWith(expectedRequest);
    });

    it('Clicking button with title "Run this paragraph" should create request', () => {
      const expectedRequest = {
        op:'CANCEL_PARAGRAPH',
        data:{
          id:'paragraphId'
        }
      };
      paragraph = runningParagraph;
      fixture.componentRef.setInput('paragraph', paragraph);
      fixture.detectChanges();
      fireEvent.click(screen.getByRole('button'));
      expect(requestSpy).toHaveBeenCalledExactlyOnceWith(expectedRequest);
    });
  });
});
