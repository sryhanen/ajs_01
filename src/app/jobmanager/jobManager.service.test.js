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
import {ParagraphStatus} from '../notebook/paragraph/paragraph.status';
import {JobManagerService} from './jobManager.service';

describe('JobManagerService', () => {
  const baseUrlSrvMock = {getRestApiBase: () => ''};
  let service;
  let $httpBackend;
  const websocketMsgSrvMock = {
    getNote: function() {},
    listRevisionHistory: function() {},
    getInterpreterBindings: function() {},
    updateNote: function() {},
    renameNote: function() {},
    listConfigurations: function() {},
    convertNote: function() {},
    checkpointNote: function() {},
    setNoteRevision: function() {},
    runAllParagraphs: function() {},
    saveInterpreterBindings: function() {},
    updatePersonalizedMode: function() {},
    moveParagraph: function() {},
    insertParagraph: function() {},
    getNoteByRevision: function() {},
  };

  beforeEach(angular.mock.module('zeppelinWebApp.jobManager'));
  beforeEach(angular.mock.inject((_$rootScope_, _$httpBackend_, _$http_) => {
    $httpBackend = _$httpBackend_;
    service = new JobManagerService(_$http_, _$rootScope_, baseUrlSrvMock, websocketMsgSrvMock);
  }));

  it('should sent valid request to run a job', () => {
    const paragraphs = [{status: ParagraphStatus.PENDING}];
    const mockNote = createMockNote(paragraphs);

    const noteId = mockNote.noteId;
    service.sendRunJobRequest(noteId);

    const url = `/notebook/job/${noteId}`;

    $httpBackend
      .when('POST', url)
      .respond(200, { /** return nothing */ });
    $httpBackend.expectPOST(url);
    $httpBackend.flush();

    checkUnknownHttpRequests();
  });

  it('should sent valid request to stop a job', () => {
    const paragraphs = [{status: ParagraphStatus.PENDING}];
    const mockNote = createMockNote(paragraphs);

    const noteId = mockNote.noteId;
    service.sendStopJobRequest(noteId);

    const url = `/notebook/job/${noteId}`;

    $httpBackend
      .when('DELETE', url)
      .respond(200, { /** return nothing */ });
    $httpBackend.expectDELETE(url);
    $httpBackend.flush();

    checkUnknownHttpRequests();
  });

  function checkUnknownHttpRequests() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  }

  function createMockNote(paragraphs) {
    return {
      isRunningJob: false,
      paragraphs: paragraphs,
      noteId: 'NT01',
      noteName: 'TestNote01',
      noteType: 'normal',
    };
  }
});
