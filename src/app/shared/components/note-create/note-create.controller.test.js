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
describe('Controller: NoteCreateCtrl', function() {
  beforeEach(angular.mock.module('zeppelinWebApp.comNoteCreate'));

  let scope;
  let ctrl;

  const noteCreateServiceMock = {

  };

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

  const CCDTMock = {
    setCallback: function () {},
  };

  const websocketMsgSrvMock = {
    createNotebook: function() {},
  };

  const routeParamsMock = {
    revisionId: '',
    noteId: '',
  };

  beforeEach(angular.mock.inject(function($injector, $rootScope, $controller) {
    scope = $rootScope.$new();
    ctrl = $controller('NoteCreateCtrl', {
      $scope: scope,
      $routeParams: routeParamsMock,
      noteListFactory: noteListFactoryMock,
      CrossControllerDataTransfer: CCDTMock,
      websocketMsgSrv: websocketMsgSrvMock,
      noteCreateService: noteCreateServiceMock,
    });
  }));

  const functions = [
    'checkEnter', 'createNoteClick', 'closeNote',
    'validate', 'setName',
  ];

  functions.forEach(function(fn) {
    it(`check for scope functions to be defined : ${fn}`, function() {
      expect(scope[fn]).toBeDefined();
    });
  });

  it('should validate the notename correctly', function() {
    scope.validate();

    expect(scope.validator).toBeTruthy();
    expect(scope.shortName).toBeTruthy();
    expect(scope.longName).toBeFalsy();
    scope.note.notename = 'test';
    scope.validate();

    expect(scope.validator).toBeTruthy();
    expect(scope.shortName).toBeFalsy();
    expect(scope.longName).toBeFalsy();
    scope.note.notename = 'te%@st';
    scope.validate();

    expect(scope.validator).toBeFalsy();
    expect(scope.shortName).toBeFalsy();
    expect(scope.longName).toBeFalsy();
    scope.note.notename = '';
    scope.validate();

    expect(scope.validator).toBeTruthy();
    expect(scope.shortName).toBeTruthy();
    expect(scope.longName).toBeFalsy();
    scope.note.notename = 'teeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeest';
    scope.validate();

    expect(scope.validator).toBeTruthy();
    expect(scope.shortName).toBeFalsy();
    expect(scope.longName).toBeTruthy();
  });

  it('should create a note only twice', function() {
    spyOn(ctrl, 'createNote');
    const pressedEnter = {
      keyCode: 13,
    };
    scope.note.notename = 'test';
    scope.validate();
    scope.checkEnter(pressedEnter);
    scope.note.notename = 'te%@st';
    scope.validate();
    scope.checkEnter(pressedEnter);
    scope.note.notename = '';
    scope.validate();
    scope.checkEnter(pressedEnter);
    scope.note.notename = 'teeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeest';
    scope.validate();
    scope.checkEnter(pressedEnter);
    scope.note.notename = 'testfolder/oneMore/andMore/soItWillBeOver90/butItStillNeedToCountOnlyNoteName/andFolderNameCanBeAnyLength/test';
    scope.validate();
    scope.checkEnter(pressedEnter);
    expect(ctrl.createNote).toHaveBeenCalledTimes(2);
  });

});
