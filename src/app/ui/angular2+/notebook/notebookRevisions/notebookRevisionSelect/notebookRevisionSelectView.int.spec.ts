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

import {Requestable} from '../../../../../objects/channel/requestable';
import {RevisionCommit} from '../../../../../objects/revisionCommit/revisionCommit';
import {ComponentView} from '../../../../../objects/rendering/componentView/componentView';
import {FakeChannel} from '../../../../../objects/channel/fakeChannel';
import {ComponentViewStub} from '../../../../../objects/rendering/componentView/componentViewStub';
import {ComponentFixture} from '@angular/core/testing';
import {NotebookRevisionSelectView} from './notebookRevisionSelectView';
import {fireEvent, render, screen} from '@testing-library/angular';
import {Component, signal} from '@angular/core';
import {ComponentViewImpl} from '../../../../../objects/rendering/componentView/componentViewImpl';
import {By} from '@angular/platform-browser';

describe('NotebookRevisionSelectView integration test', () => {
  let fixture:ComponentFixture<NotebookRevisionSelectView>;
  let requestable:Requestable;
  const revisionCommits:RevisionCommit[] = [
    {id:'commit1',message:'test 1', time:1},
    {id:'commit2',message:'test 2', time:1},
    {id:'commit3',message:'test 3', time:1}
  ];
  let selectedNotebookRevision:ComponentView;

  beforeEach(async () => {
    requestable = new FakeChannel();
    selectedNotebookRevision = new ComponentViewStub();
    const renderResult = await render(NotebookRevisionSelectView, {
      inputs:{
        requestable: requestable,
        revisionCommits: revisionCommits,
        selectedNotebookRevision: selectedNotebookRevision,
      }
    });
    fixture = renderResult.fixture;
  });

  describe('Birth', () => {
    it('Dropdown should display revision commits after clicking', () => {
      expect(() => screen.getByText(revisionCommits[0].message)).toThrow();
      expect(() => screen.getByText(revisionCommits[1].message)).toThrow();
      expect(() => screen.getByText(revisionCommits[2].message)).toThrow();
      fireEvent.click(screen.getByText('Select revision'));
      expect(screen.getByText(revisionCommits[0].message)).toBeDefined();
      expect(screen.getByText(revisionCommits[1].message)).toBeDefined();
      expect(screen.getByText(revisionCommits[2].message)).toBeDefined();
    });

    it('Dialog content should be loading', () => {
      const status = screen.getByRole('status', {hidden:true});
      expect(status).toBeDefined();
    });
  });

  describe('Selecting revision', () => {
    const selectedCommit = revisionCommits[0];

    it('Dialog should display selected commit message as header text', () => {
      const selectedCommitMessage = selectedCommit.message;
      fireEvent.click(screen.getByText('Select revision'));
      fireEvent.click(screen.getByText(selectedCommitMessage));
      const expectedHeadingText = `View commit '${selectedCommitMessage}'`;
      expect(screen.getByText(expectedHeadingText)).toBeDefined();
    });

    it('Should display selected revision component', () => {
      @Component({
        selector:'test-component',
        template:''
      })
      class TestComponent{}
      const selectedRevision = new ComponentViewImpl(TestComponent, signal({}));
      fixture.componentRef.setInput('selectedNotebookRevision', selectedRevision);
      expect(fixture.debugElement.query(By.directive(TestComponent))).toBeDefined();
    });

    it('Should send expected request when clicking restore button', () => {
      fireEvent.click(screen.getByText('Select revision'));
      fireEvent.click(screen.getByText(selectedCommit.message));
      const spy = vi.spyOn(requestable, 'request');
      fireEvent.click(screen.getByText('Restore'));
      const expectedRequest = {
        op:'SET_NOTE_REVISION',
        data:{
          noteId:'',
          revisionId:selectedCommit.id
        }
      };
      expect(spy).toHaveBeenCalledExactlyOnceWith(expectedRequest);
    });
  });
});
