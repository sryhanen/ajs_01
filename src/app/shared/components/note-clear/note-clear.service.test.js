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

describe('Service: NoteClearService', function() {
  beforeEach(angular.mock.module('zeppelinWebApp'));

  let NoteClearService,
      scope,
      $compile,
      element;

  const callbackMock = function () {};

  beforeEach(angular.mock.inject(function($injector, $rootScope,  _$compile_) {
    NoteClearService = $injector.get('noteClearService');
    scope = $rootScope.$new();
    $compile = _$compile_;
    scope.$digest();
    //set up the modal stub
    element = angular.element(
      '<div id="test" class="modal fade" aria-labelledby="testLabel" aria-hidden="true" tabindex="-1">\n' +
      '  <div class="modal-dialog modal-dialog-centered">\n' +
      '    <div class="modal-content">\n' +
      '      <div class="modal-header modal-header-rename">\n' +
      '        <h5 class="modal-title" id="testLabel">Test title</h5>\n' +
      '      </div>\n' +
      '      <div class="modal-body modal-body-rename">\n' +
      '      </div>\n' +
      '      <div class="modal-footer">\n' +
      '      </div>\n'+
      '    </div>\n' +
      '  </div>\n' +
      '</div>'
    );
    $compile(element)(scope);
    scope.$digest();
  }));


  const functions = [
    'callback',
    'openClearModal',
  ];

  functions.forEach(function(fn) {
    it(`check for service functions to be defined : ${fn}`, function() {
      expect(NoteClearService[fn]).toBeDefined();
    });
  });

  it('should set up callback', function() {
    NoteClearService.openClearModal({
      callback: callbackMock,
      modalID: 'test',
    });
    scope.$digest();
    //we expect logic to be performed before the bootstrap library is called,
    //therefore it should not be affected by it
    expect(NoteClearService.callback).toBe(callbackMock);
  });

});
