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
describe('Controller: NotePermissionsCtrl', function() {
  beforeEach(angular.mock.module('zeppelinWebApp.comNotePermissions'));

  let scope;
  let CCDT;

  const notePermissionsMock = {
    permissions: {
      owners: 'test&1',
      readers: 'test>2',
      runners: 'test<3',
      writers: 'test4',
    }
  };

  beforeEach(angular.mock.inject(function($injector, $rootScope, $controller, $templateCache, _$compile_) {

    CCDT = $injector.get('CrossControllerDataTransfer');
    scope = $rootScope.$new();

    $controller('NotePermissionsCtrl', {
      $rootScope: $rootScope,
      $scope: scope,
      NotePermissionsService: notePermissionsMock,
      CrossControllerDataTransfer: CCDT,
    });

  }));

  const functions = ['triggerCallback', 'close', 'getPermissions'];

  functions.forEach(function(fn) {
    it(`check for scope functions to be defined : ${fn}`, function() {
      expect(scope[fn]).toBeDefined();
    });
  });

  //right now it is not possible to fully simulate the modal,
  //since we do not load and operate bootstrap in the test framework
  it('should process the list of permissions correctly and escape them', function() {
    scope.getPermissions();
    expect(scope.permissions.owners).toBe('test&amp;1');
    expect(scope.permissions.readers).toBe('test&gt;2');
    expect(scope.permissions.runners).toBe('test&lt;3');
    expect(scope.permissions.writers).toBe('test4');
  });
});
