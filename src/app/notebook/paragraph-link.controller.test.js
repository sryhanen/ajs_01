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
describe('Controller: ParagraphLinkCtrl', function() {
  beforeEach(angular.mock.module('zeppelinWebApp.paragraphLink'));

  let scope;
  let location;
  let rootscope;

  const websocketMsgSrvMock = {
    getNote: function() {},
    listConfigurations: function() {},
  };

  const routeMock = {
    current: {
      pathParams: {
        noteId: 'noteId',
      },
    },
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
    paragraphs: [
      {
        id: 'paragraph2Discard',
        text: '%nothing important',
      },
      {
        id: 'testParagraphID',
        text: 'very important content'
      },
    ],
  };

  const routeParamsMock = {
    noteId: 'testID',
    paragraphId: 'testParagraphID',
    asIframe: true,
  };

  const LoginService = {
    leave: () => {
      return true;
    }
  };

  const CCDTMock = {
    triggerCallback: function(message, data){

    },
  };


  beforeEach(angular.mock.inject(function($controller, $rootScope, $httpBackend, $location) {
    scope = $rootScope.$new();
    rootscope = $rootScope;
    location = $location;
    location.path('/test');
    $controller('ParagraphLinkCtrl', {
      $rootScope: rootscope,
      $scope: scope,
      $location: location,
      websocketMsgSrv: websocketMsgSrvMock,
      baseUrlSrv: baseUrlSrvMock,
      $routeParams: routeParamsMock,
      $route: routeMock,
      LoginService: LoginService,
      CrossControllerDataTransfer: CCDTMock,
    });
  }));

  beforeEach(function() {
    scope.note = noteMock;
  });

  const functions = [
    'isNoteRunning',
    'paragraphOnDoubleClick',
    'isOwnerEmpty',
    'showParagraphWarning',
  ];

  functions.forEach(function(fn) {
    it(`check for scope functions to be defined : ${fn}`, function() {
      expect(scope[fn]).toBeDefined();
    });
  });

  it('should set default value of "editorToggled" to false', function() {
    expect(scope.editorToggled).toEqual(true);
  });

  it('should have isNoteRunning returning false by default', function() {
    expect(scope.isNoteRunning()).toEqual(false);
  });

  it('should set up note content correctly', function() {
    rootscope.$broadcast('setNoteContent', noteMock);
    expect(scope.paragraphUrl).toEqual('testParagraphID');
    expect(scope.asIframe).toEqual(true);
    const trimmedParagraph = [
      {
        id: 'testParagraphID',
        text: 'very important content'
      },
    ];
    expect(scope.note.paragraphs).toEqual(trimmedParagraph);
  });

});
