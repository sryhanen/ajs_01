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
describe('Module Controller: Angular', function() {
  beforeEach(angular.mock.module('zeppelinWebApp.vizAngular'));

  let scope;
  let emptyScope;
  let emptyScope2;
  let controller;
  let compile;
  let elementMock;
  let storage = {};
  const vizRegisterServiceMock = {
    linkUpdateViz: function (id, index, refresh) {

      storage = {
        id: id,
        index: index,
        refresh: refresh,
      };

    }
  };
  const noteVarShareServiceMock = {
    get: function (id) {

      return emptyScope2;
    }
  };

  const CCDTMock = {
    triggerCallback: function (id) {

    }
  };

  beforeEach(angular.mock.inject(
    function(
      $controller,
      $rootScope,
      $compile,
    ) {

      scope = $rootScope.$new();
      emptyScope = $rootScope.$new();
      emptyScope2 = $rootScope.$new();
      compile = $compile;

      controller = $controller('AngularCtrl', {
        $scope: scope,
        $compile: compile,
        vizRegisterService: vizRegisterServiceMock,
        noteVarShareService: noteVarShareServiceMock,
        CrossControllerDataTransfer: CCDTMock,
      });

    }));

  const functions = [
    'initResult',
    'initViz',
  ];

  functions.forEach(function(fn) {
    it(`check for scope functions to be defined : ${fn}`, function() {
      expect(scope[fn]).toBeDefined();
    });
  });

  it('scope should be initialized', function() {
    expect(scope).toBeDefined();
    expect(controller).toBeDefined();

  });

  it('scope init controller correctly', function() {
    scope.initResult(
      'testID',
      0,
      '<div><b>test</b></div>',
      {},
    );
    expect(scope.paragraphID).toEqual('testID');
    expect(scope.containerID).toEqual('testID_0');
    expect(scope.data).toEqual('<div><b>test</b></div>');
    expect(scope.loaded).toBeTruthy();
    expect(storage.id).toEqual('testID');
    expect(storage.index).toEqual(0);
  });

  it('viz should init and refresh correctly', function() {
    scope.initResult(
      'testID',
      0,
      '<div><b>test</b></div>',
      {},
    );
    const template = '<div id=\'testID_0_viz\'></div>';
    elementMock = compile(template)(emptyScope);
    scope.initViz(elementMock);

    expect(elementMock.html()).toEqual('<div class="ng-scope"><b>test</b></div>');
    const refreshData = '<div><b>this_content_was_refreshed</b></div>';
    storage.refresh(refreshData);
    expect(elementMock.html()).toEqual('<div class="ng-scope"><b>this_content_was_refreshed</b></div>');
  });

});
