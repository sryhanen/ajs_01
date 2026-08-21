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
import {FakeChannel} from '../../../objects/channel/fakeChannel';
import {ParagraphView} from './paragraphView';
import {render} from '@testing-library/angular';
import {By} from '@angular/platform-browser';
import {ComponentFixture} from '@angular/core/testing';
import {ParagraphControlsView} from './paragraphControls/paragraphControlsView';
import {Component, signal} from '@angular/core';
import {Requestable} from '../../../objects/channel/requestable';
import {ComponentViewImpl} from '../../../objects/rendering/componentView/componentViewImpl';
import {ParagraphProgressBar} from './progressBar/paragraphProgressBar';
import {ParagraphExecutionTimeView} from './paragraphExecutionTime/paragraphExecutionTimeView';
import {ParagraphElapsedTimeView} from './paragraphElapsedTime/paragraphElapsedTimeView';
import {ParagraphTitleView} from './paragraphTitle/paragraphTitleView';

describe('ParagraphView integration test', () => {
  @Component({
    selector: 'editor',
    template: ''
  })
  class FakeEditorComponent{}
  @Component({
    selector: 'output',
    template: ''
  })
  class FakeOutputComponent{}
  @Component({
    selector: 'dynamic-form',
    template: ''
  })
  class FakeDynamicFormComponent{}
  @Component({
    selector: 'dpl-log',
    template: ''
  })
  class FakeDplLogFormComponent{}


  let fixture: ComponentFixture<ParagraphView>;
  let requestable:Requestable;
  const paragraphData = {
    id:'id',
    text:'text',
    title:'',
    status:'Finished',
    config:{

      colWidth:0,
    },
    setting:{}
  };
  const editor = new ComponentViewImpl(FakeEditorComponent, signal({}));
  const output = new ComponentViewImpl(FakeOutputComponent, signal({}));
  const dynamicForm = new ComponentViewImpl(FakeDynamicFormComponent, signal({}));
  const dplLog = new ComponentViewImpl(FakeDplLogFormComponent, signal({}));

  beforeEach(async () => {
    requestable = new FakeChannel();
    const renderResult = await render(ParagraphView, {
      inputs:{
        paragraphData:paragraphData,
        requestable:requestable,
        editor:editor,
        output:output,
        dynamicForm:dynamicForm,
        dplLog:dplLog,
      }
    });
    fixture = renderResult.fixture;
  });

  describe('Birth', () => {
    it('Should have rendered component view', () => {
      expect(fixture.debugElement.query(By.directive(ParagraphControlsView))).toBeDefined();
      expect(fixture.debugElement.query(By.directive(ParagraphProgressBar))).toBeDefined();
      expect(fixture.debugElement.query(By.directive(ParagraphExecutionTimeView))).toBeDefined();
      expect(fixture.debugElement.query(By.directive(ParagraphElapsedTimeView))).toBeDefined();
      expect(fixture.debugElement.query(By.directive(ParagraphTitleView))).toBeDefined();
      expect(fixture.debugElement.query(By.directive(FakeEditorComponent))).toBeDefined();
      expect(fixture.debugElement.query(By.directive(FakeOutputComponent))).toBeDefined();
      expect(fixture.debugElement.query(By.directive(FakeDynamicFormComponent))).toBeDefined();
      expect(fixture.debugElement.query(By.directive(FakeDplLogFormComponent))).toBeDefined();
    });
  });
});
