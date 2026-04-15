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
describe('Controller: NoteCloneCtrl', function() {
  beforeEach(angular.mock.module('zeppelinWebApp.comNoteClone'));

  let scope;
  let noteCloneService;
  let ctrl2;

  const noteListFactoryMock = {
    flatList: [],
    setNotes: function (notes){
      this.flatList = notes.map((note) => {
        const notePath = note.path || note.id;
        const nodes = notePath.match(/([^\/][^\/]*)/g) || [];
        note.name = nodes.pop();
        return note;
      });
    }
  };

  const websocketMsgSrvMock = {
    getNote: function() {},
    listRevisionHistory: function() {},
    getInterpreterBindings: function() {},
    updateNote: function() {},
    renameNote: function() {},
    listConfigurations: function() {},
  };

  const routeParamsMock = {
    revisionId: '',
    noteId: '',
  };

  beforeEach(angular.mock.inject(function($injector, $rootScope, $controller) {
    noteCloneService = $injector.get('noteCloneService');
    scope = $rootScope.$new();
    ctrl2 = $controller('NoteCloneCtrl', {
      $scope: scope,
      $routeParams: routeParamsMock,
      noteListFactory: noteListFactoryMock,
      noteCloneService: noteCloneService,
      websocketMsgSrv: websocketMsgSrvMock,
    });
  }));

  it('should create a new name from current name when cloneNoteName is called', function() {
    const notesList = [
      {path: 'dsds 1', id: '1'},
      {path: 'dsds 2', id: '2'},
      {path: 'test name', id: '3'},
      {path: 'aa bb cc', id: '4'},
      {path: 'Untitled Note 6', id: '4'},
    ];

    noteListFactoryMock.setNotes(notesList);

    noteCloneService.init('test name');
    expect(ctrl2.cloneNoteName()).toEqual('test name 1');
    noteCloneService.init('aa bb cc');
    expect(ctrl2.cloneNoteName()).toEqual('aa bb cc 1');
    noteCloneService.init('Untitled Note 6');
    expect(ctrl2.cloneNoteName()).toEqual('Untitled Note 7');
    noteCloneService.init('My_note');
    expect(ctrl2.cloneNoteName()).toEqual('My_note 1');
    noteCloneService.init('dsds 2');
    expect(ctrl2.cloneNoteName()).toEqual('dsds 3');
  });
});
