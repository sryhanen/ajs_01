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
import {ParagraphStatus} from '../../notebook/paragraph/paragraph.status';

describe('JobComponent', () => {
  let $componentController;

  beforeEach(angular.mock.module('zeppelinWebApp.job'));
  beforeEach(angular.mock.inject((_$componentController_) => {
    $componentController = _$componentController_;
  }));

  it('should get progress when there is a finished paragraph', () => {
    const paragraphs = [
      {status: ParagraphStatus.FINISHED},
    ];
    const mockNote = createMockNote(paragraphs);
    const bindings = {note: mockNote};

    const ctrl = $componentController('job', null, bindings);
    expect(ctrl).toBeDefined();

    const progress1 = ctrl.getProgress();
    expect(progress1).toBe(100);
  });

  it('should get progress when there is pending and finished paragraphs', () => {
    const paragraphs = [
      {status: ParagraphStatus.PENDING},
      {status: ParagraphStatus.FINISHED},
    ];
    const mockNote = createMockNote(paragraphs);
    const bindings = {note: mockNote};

    const ctrl = $componentController('job', null, bindings);

    const progress1 = ctrl.getProgress();
    expect(progress1).toBe(50);
  });

  it('should get proper job type icons', () => {
    const paragraphs = [{status: ParagraphStatus.PENDING}];
    const mockNote = createMockNote(paragraphs);
    const bindings = {note: mockNote};

    const ctrl = $componentController('job', null, bindings);

    let icon = ctrl.getJobTypeIcon();
    expect(icon).toBe('fas fa-file');

    mockNote.noteType = 'cron';
    icon = ctrl.getJobTypeIcon();
    expect(icon).toBe('fas fa-clock');
  });

  function createMockNote(paragraphs) {
    return {
      isRunningJob: false,
      paragraphs: paragraphs,
      noteId: 'NT01',
      noteName: 'TestNote01',
      noteType: 'normal',
    };
  }

  it('should get set of classnames when the progressbar is not full', () => {
    const paragraphs = [
      {status: ParagraphStatus.PENDING},
      {status: ParagraphStatus.FINISHED},
    ];
    const mockNote = createMockNote(paragraphs);
    const bindings = {note: mockNote};

    const ctrl = $componentController('job', null, bindings);

    const progress1 = ctrl.getClassNames();
    expect(progress1).toBe('w-60');
  });

  it('should get set of classnames when the progress is 100%', () => {
    const paragraphs = [
      {status: ParagraphStatus.FINISHED},
    ];
    const mockNote = createMockNote(paragraphs);
    const bindings = {note: mockNote};

    const ctrl = $componentController('job', null, bindings);

    const progress1 = ctrl.getClassNames();
    expect(progress1).toBe('progress-bar-striped progress-bar-animated active w-100');
  });
});
