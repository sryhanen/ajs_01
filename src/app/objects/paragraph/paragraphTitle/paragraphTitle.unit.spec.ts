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
import {ParagraphTitle} from './paragraphTitle';
import {Requestable} from '../../channel/requestable';
import {FakeChannel} from '../../channel/fakeChannel';
import {ParagraphTitleImpl} from './paragraphTitleImpl';
import {RegisteredComponents} from '../../../ui/angular2+/componentRegistry/registeredComponents';

describe('ParagraphTitle unit test', () => {
  let paragraphTitle:ParagraphTitle;
  let requestable:Requestable;

  it('Should have signal string value', () => {
    const initialTitle = 'some initial title text';
    requestable = new FakeChannel();
    paragraphTitle = new ParagraphTitleImpl(initialTitle, requestable);
    const signalStringValue = paragraphTitle.asStringSignal()();
    expect(signalStringValue).toEqual(initialTitle);
  });

  it('Should update title', () => {
    const initialTitle = 'some initial title text';
    requestable = new FakeChannel();
    paragraphTitle = new ParagraphTitleImpl(initialTitle, requestable);
    const initialTitleValue = paragraphTitle.asStringSignal()();
    const newTitle = 'new title';
    paragraphTitle.update(newTitle);
    const updatedTitle = paragraphTitle.asStringSignal()();
    expect(initialTitleValue).toEqual(initialTitle);
    expect(updatedTitle).toEqual(newTitle);
  });

  it('Should create update request on title update', () => {
    const initialTitle = '';
    requestable = new FakeChannel();
    paragraphTitle = new ParagraphTitleImpl(initialTitle, requestable);
    const newTitle = 'new title';
    const requestSpy = vi.spyOn(requestable, 'request');
    paragraphTitle.update(newTitle);
    const expectedRequest = {
      op:'TITLE_UPDATED',
      data:{
        paragraphId:'',
        newValue:newTitle
      }
    };
    expect(requestSpy).toHaveBeenCalledExactlyOnceWith(expectedRequest);
  });

  it('Should print', () => {
    const initialTitle = '';
    requestable = new FakeChannel();
    paragraphTitle = new ParagraphTitleImpl(initialTitle, requestable);
    const printed = paragraphTitle.print()();
    expect(printed.isStub()).toBe(false);
    expect(printed.componentView()).toEqual(RegisteredComponents.PARAGRAPH_TITLE_VIEW);
    expect(printed.inputs()().paragraphTitle).toBeDefined();
  });
});
