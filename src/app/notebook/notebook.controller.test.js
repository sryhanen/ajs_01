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
describe('Controller: NotebookCtrl', function() {
  beforeEach(angular.mock.module('zeppelinWebApp.notebook'));

  let scope,
      httpBackend,
      urlput,
      compile,
      spy,
      location;

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
    copyParagraph: function() {},
    runParagraph: function() {},
    saveParagraph: function() {},
  };

  const noteActionMock = {
    moveNoteToTrash: function() {},
    removeNote: function() {},
    clearNote: function() {},
  };

  const functionMock = function (input) {
  };

  const routeMock = {
    current: {
      pathParams: {
        noteId: 'noteId',
      },
    },
  };

  const saveAsMock = {
    saveAs: function(){},
  };

  const baseUrlSrvMock = {
    getRestApiBase: function() {
      return 'http://localhost:8080';
    },
  };

  const noteMock = {
    id: 1,
    name: 'my note',
    config: {},
    checkpoint: {},
    paragraphs: [],
  };

  const routeParamsMock = {
    revisionId: '',
    noteId: 'testID',
  };

  const rootscopeMock = {
    ticket: {
      roles: '["admin", "god", "test"]',
      principal: 'tester',
    },
    $broadcast: function (string) {

    },
  };

  const notePermissionsModalMock = {
    setPermissionsModal: function(){},
  };

  const CCDTMock = {
    triggerCallback: function(message, data){

    },
  };

  const PUTPermissions = {
    owners: ['test1'],
    writers: ['test2'],
    runners: ['test3'],
    readers: ['test4'],
  };

  const GETPermissions = {
    owners: ['test5'],
    writers: ['test6'],
    runners: ['test7'],
    readers: ['test8'],
  };

  beforeEach(angular.mock.inject(function($controller, $rootScope, $httpBackend, $location, $compile) {
    scope = $rootScope.$new();
    compile = $compile;
    httpBackend = $httpBackend;
    location = $location;
    location.path('/test');

    $controller('NotebookCtrl', {
      $rootScope: rootscopeMock,
      $scope: scope,
      websocketMsgSrv: websocketMsgSrvMock,
      baseUrlSrv: baseUrlSrvMock,
      $routeParams: routeParamsMock,
      $route: routeMock,
      saveAsService: saveAsMock,
      noteActionService: noteActionMock,
      NotePermissionsService: notePermissionsModalMock,
      CrossControllerDataTransfer: CCDTMock,
    });
  }));

  beforeEach(function() {
    scope.note = noteMock;
    //important to fake calls to other scopes
    const scopeMock = {
      scope: function() {
        return {saveParagraph: functionMock};
      },
      off: function () {

      },
      select2: function(){},
      dropdown: function(){},
    };
    spy = spyOn(angular, 'element').and.callFake(function () {
      return scopeMock;
    });
    //faking server permission calls
    urlput = 'http://localhost:8080/notebook/1/permissions';
    httpBackend
      .when('PUT', urlput)
      .respond({body: 'test', message: 'no error message'}, 200, {headers: 'some headers'}, {config: 'some config'});
    httpBackend
      .when('GET', urlput)
      .respond({body: GETPermissions}, 200, {headers: 'some headers'}, {config: 'some config'});
  });

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  const functions = [
    'getCronOptionNameFromValue',
    'removeNote',
    'runAllParagraphs',
    'saveNote',
    'toggleAllEditor',
    'showAllEditor',
    'hideAllEditor',
    'toggleAllTable',
    'hideAllTable',
    'showAllTable',
    'isNoteRunning',
    'killSaveTimer',
    'startSaveTimer',
    'setLookAndFeel',
    'setCronScheduler',
    'setConfig',
    'updateNoteName',
    'saveSetting',
    'toggleSetting',
    'closePermissionsModal',
    'openPermissions',
    'togglePermissions',
    'setMyPermissions',
    'setPermissions',
    'savePermissions',
    'moveParagraphUp',
    'moveParagraphDown',
    'moveParagraphTop',
    'moveParagraphBottom',
    'focusOn',
  ];

  functions.forEach(function(fn) {
    it(`check for scope functions to be defined : ${fn}`, function() {
      expect(scope[fn]).toBeDefined();
    });
  });

  it('should set default value of "editorToggled" to false', function() {
    expect(scope.editorToggled).toEqual(false);
  });

  it('should return the correct value for getCronOptionNameFromValue()', function() {
    const none = scope.getCronOptionNameFromValue();
    const oneHour = scope.getCronOptionNameFromValue('0 0 0/1 * * ?');
    const threeHours = scope.getCronOptionNameFromValue('0 0 0/3 * * ?');
    const sixHours = scope.getCronOptionNameFromValue('0 0 0/6 * * ?');
    const twelveHours = scope.getCronOptionNameFromValue('0 0 0/12 * * ?');
    const oneDay = scope.getCronOptionNameFromValue('0 0 0 * * ?');

    expect(none).toEqual('');
    expect(oneHour).toEqual('1h');
    expect(threeHours).toEqual('3h');
    expect(sixHours).toEqual('6h');
    expect(twelveHours).toEqual('12h');
    expect(oneDay).toEqual('1d');
  });

  it('should have "isNoteDirty" as null by default', function() {
    expect(scope.isNoteDirty).toEqual(null);
  });

  it('should first call killSaveTimer() when calling startSaveTimer()', function() {
    expect(scope.saveTimer).toEqual(null);
    spyOn(scope, 'killSaveTimer');
    scope.startSaveTimer();
    expect(scope.killSaveTimer).toHaveBeenCalled();
  });

  it('should set "saveTimer" when saveTimer() and killSaveTimer() are called', function() {
    expect(scope.saveTimer).toEqual(null);
    scope.startSaveTimer();
    expect(scope.saveTimer).toBeTruthy();
    scope.killSaveTimer();
    expect(scope.saveTimer).toEqual(null);
  });

  it('should NOT update note name when updateNoteName() is called with an invalid name', function() {
    spyOn(websocketMsgSrvMock, 'renameNote');
    scope.updateNoteName('');
    expect(scope.note.name).toEqual(noteMock.name);
    expect(websocketMsgSrvMock.renameNote).not.toHaveBeenCalled();
    scope.updateNoteName(' ');
    expect(scope.note.name).toEqual(noteMock.name);
    expect(websocketMsgSrvMock.renameNote).not.toHaveBeenCalled();
    scope.updateNoteName(scope.note.name);
    expect(scope.note.name).toEqual(noteMock.name);
    expect(websocketMsgSrvMock.renameNote).not.toHaveBeenCalled();
  });

  it('should update note name when updateNoteName() is called with a valid name', function() {
    spyOn(websocketMsgSrvMock, 'renameNote');
    const newName = 'Your Note';
    scope.updateNoteName(newName);
    expect(scope.note.name).toEqual(newName);
    expect(websocketMsgSrvMock.renameNote).toHaveBeenCalled();
  });

  it('should reload note info once per one "setNoteMenu" event', function() {
    spyOn(websocketMsgSrvMock, 'getNote');
    spyOn(websocketMsgSrvMock, 'listRevisionHistory');

    scope.$broadcast('setNoteMenu');
    expect(websocketMsgSrvMock.getNote.calls.count()).toEqual(0);
    expect(websocketMsgSrvMock.listRevisionHistory.calls.count()).toEqual(0);

    websocketMsgSrvMock.getNote.calls.reset();
    websocketMsgSrvMock.listRevisionHistory.calls.reset();

    scope.$broadcast('setNoteMenu');
    expect(websocketMsgSrvMock.getNote.calls.count()).toEqual(0);
    expect(websocketMsgSrvMock.listRevisionHistory.calls.count()).toEqual(0);
  });

  it('should run setMyPermissons and setup scope vars', function() {
    scope.permissions = {};
    scope.permissions.owners = ['god'];
    scope.permissions.writers = ['mereHuman'];
    scope.setMyPermissions();
    expect(scope.isOwner).toBeTruthy();
    expect(scope.isWriter).toBeFalsy();
    expect(scope.viewOnly).toBeFalsy();
  });

  it('should send a correct data to a correct URL and receive-process it correctly', function() {

    scope.permissions = PUTPermissions;

    httpBackend.expectPUT(urlput, PUTPermissions);
    httpBackend.expectGET(urlput);

    scope.setPermissions();
    httpBackend.flush();

    expect(scope.permissions).toEqual(GETPermissions);
  });

  it('escaping the array should be done properly', function() {
    const testArray = ['adm&in', 'go>d', 't<est'];
    const escapedArray = scope.escapeArray(testArray);
    expect(escapedArray).toEqual(['adm&amp;in', 'go&gt;d', 't&lt;est']);
  });

  it('committing with empty message should end up with error', function() {
    scope.note.checkpoint.message = '';
    scope.checkpointError = '';
    scope.checkpointNote('');
    expect(scope.checkpointError).toEqual('The name of the save cannot be empty');
  });

  it('committing with some message should be sent to server', function() {
    scope.note.checkpoint.message = 'test1';
    scope.checkpointError = 'Some old error';
    spyOn(websocketMsgSrvMock, 'checkpointNote');
    scope.checkpointNote('test');
    expect(scope.note.checkpoint.message).toEqual('');
    expect(scope.checkpointError).toEqual('');
    expect(websocketMsgSrvMock.checkpointNote).toHaveBeenCalledWith('testID','test');
  });

  it('should setup a note, but fail and return with falling back to /', function() {
    spyOn(websocketMsgSrvMock, 'copyParagraph');
    spyOn(websocketMsgSrvMock, 'getNote');
    spyOn(websocketMsgSrvMock, 'runParagraph');
    scope.$broadcast('setNoteContent');
    expect(websocketMsgSrvMock.copyParagraph.calls.count()).toEqual(0);
    expect(websocketMsgSrvMock.getNote.calls.count()).toEqual(0);
    expect(websocketMsgSrvMock.runParagraph.calls.count()).toEqual(0);
    expect(location.path()).toEqual('/');
  });

  it('should setup a note for the first time, and then for the second time, creating the preload paragraph', function() {
    spyOn(websocketMsgSrvMock, 'copyParagraph');
    spyOn(websocketMsgSrvMock, 'getNote');
    spyOn(websocketMsgSrvMock, 'runParagraph');
    scope.note.paragraphs[0] = {title: 'test'};
    scope.$broadcast('setNoteContent', noteMock);
    expect(websocketMsgSrvMock.copyParagraph.calls.count()).toEqual(1);
    expect(websocketMsgSrvMock.getNote.calls.count()).toEqual(1);
    expect(websocketMsgSrvMock.runParagraph.calls.count()).toEqual(0);
    expect(location.path()).toEqual('/test');
    websocketMsgSrvMock.copyParagraph.calls.reset();
    websocketMsgSrvMock.getNote.calls.reset();
    websocketMsgSrvMock.runParagraph.calls.reset();
    scope.note.paragraphs[0] = {title: 'hideMeSparkPinger', text: '%spark //', id:'testID', config: {}};
    scope.$broadcast('setNoteContent', scope.note);
    expect(websocketMsgSrvMock.copyParagraph.calls.count()).toEqual(0);
    expect(websocketMsgSrvMock.getNote.calls.count()).toEqual(0);
    expect(websocketMsgSrvMock.runParagraph.calls.count()).toEqual(1);
    expect(location.path()).toEqual('/test');
    scope.note.paragraphs = [];
    httpBackend.flush();
  });

  it('should setup a note, find %spark.conf and skip preload part', function() {
    spyOn(websocketMsgSrvMock, 'copyParagraph');
    spyOn(websocketMsgSrvMock, 'getNote');
    spyOn(websocketMsgSrvMock, 'runParagraph');
    scope.note.paragraphs[0] = {title: 'test', text: '%spark.conf test-test-test'};
    scope.$broadcast('setNoteContent', scope.note);
    expect(websocketMsgSrvMock.copyParagraph.calls.count()).toEqual(0);
    expect(websocketMsgSrvMock.getNote.calls.count()).toEqual(0);
    expect(websocketMsgSrvMock.runParagraph.calls.count()).toEqual(0);
    expect(location.path()).toEqual('/test');
    scope.note.paragraphs = [];
    httpBackend.flush();
  });

  it('should move paragraphs up and call websocket', function() {
    spyOn(websocketMsgSrvMock, 'moveParagraph');
    scope.note.paragraphs = [
      {id: 'test1'},
      {id: 'test2'},
      {id: 'test3'},
    ];
    scope.$digest();
    scope.moveParagraphUp({id: 'test3'});
    expect(websocketMsgSrvMock.moveParagraph.calls.count()).toEqual(1);
    expect(websocketMsgSrvMock.moveParagraph).toHaveBeenCalledWith('test3', 1);
    expect(angular.element.calls.count()).toEqual(2);
  });

  it('should move paragraphs down and call websocket', function() {
    spyOn(websocketMsgSrvMock, 'moveParagraph');
    scope.note.paragraphs = [
      {id: 'test1'},
      {id: 'test2'},
      {id: 'test3'},
    ];
    scope.$digest();
    scope.moveParagraphDown({id: 'test1'});
    expect(websocketMsgSrvMock.moveParagraph.calls.count()).toEqual(1);
    expect(websocketMsgSrvMock.moveParagraph).toHaveBeenCalledWith('test1', 1);
    expect(angular.element.calls.count()).toEqual(2);
  });

  it('should move paragraphs to top and call websocket', function() {
    spyOn(websocketMsgSrvMock, 'moveParagraph');
    scope.note.paragraphs = [
      {id: 'test1'},
      {id: 'test2'},
      {id: 'test3'},
    ];
    scope.$digest();
    scope.moveParagraphTop({id: 'test3'});
    expect(websocketMsgSrvMock.moveParagraph.calls.count()).toEqual(1);
    expect(websocketMsgSrvMock.moveParagraph).toHaveBeenCalledWith('test3', 1);
    //note, index is not 0, since it is reserved for the preloader
    expect(angular.element.calls.count()).toEqual(2);
  });

  it('should move paragraphs to bottom and call websocket', function() {
    spyOn(websocketMsgSrvMock, 'moveParagraph');
    scope.note.paragraphs = [
      {id: 'test1'},
      {id: 'test2'},
      {id: 'test3'},
    ];
    scope.$digest();
    scope.moveParagraphBottom({id: 'test1'});
    expect(websocketMsgSrvMock.moveParagraph.calls.count()).toEqual(1);
    expect(websocketMsgSrvMock.moveParagraph).toHaveBeenCalledWith('test1', 2);
    expect(angular.element.calls.count()).toEqual(2);
  });

  it('should focus on correct element', function() {
    const template = '<input id="testInput"></input>';
    spy.and.callThrough(); //enable angular back
    spyOn(scope, 'saveNote'); //disable part of "on $destroy" event
    angular.element('body').append(template);
    compile(template)(scope);
    const element = document.getElementById('testInput');
    scope.focusOn('testInput');
    expect(element.matches(':focus')).toBeTruthy();
  });

});
