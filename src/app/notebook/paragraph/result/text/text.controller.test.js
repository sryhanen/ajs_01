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
describe('Module Controller: text', function() {
  beforeEach(angular.mock.module('zeppelinWebApp.vizText'));

  let scope;
  let emptyScope;
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

  beforeEach(angular.mock.inject(
    function(
      $controller,
      $rootScope,
      $compile,
    ) {

      scope = $rootScope.$new();
      emptyScope = $rootScope.$new();
      compile = $compile;

      controller = $controller('TextCtrl', {
        $scope: scope,
        $compile: compile,
        vizRegisterService: vizRegisterServiceMock,
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
      'someTest_text',
      {},
    );
    expect(scope.containerID).toEqual('testID_0');
    expect(scope.data).toEqual('someTest_text');
    expect(scope.loaded).toBeTruthy();
    expect(storage.id).toEqual('testID');
    expect(storage.index).toEqual(0);
  });

  it('viz should init and refresh correctly', function() {
    scope.initResult(
      'testID',
      0,
      'someTest_text2+<html>',
      {},
    );
    const template = '<div id=\'testID_0_viz\'></div>';
    elementMock = compile(template)(emptyScope);
    scope.initViz(elementMock);

    expect(elementMock.html()).toEqual('<div>someTest_text2+&lt;html&gt;</div>');
    let refreshData = 'testRefresh<script>some malicious script</script> and other carriages';
    //refresh completely
    storage.refresh(refreshData, true);

    expect(elementMock.html()).toEqual('<div>testRefresh&lt;script&gt;some malicious script&lt;/script&gt; and other carriages</div>');
    //refresh append
    refreshData = 'this will be removed \r and this won\'t';
    storage.refresh(refreshData);

    expect(elementMock.html()).toEqual('<div>testRefresh&lt;script&gt;some malicious script&lt;/script&gt; and other carriages</div><div> and this won\'t</div>');
  });
});
