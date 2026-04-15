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
describe('Controller: MainCtrl', function() {
  beforeEach(angular.mock.module('zeppelinWebApp'));

  let scope;
  let rootScope;
  let window;
  let http;

  const CCDTMock = {
    callbacklist: [],
    setCallback: function (name, callback){
      this.callbacklist[name] = callback;
    }
  };

  const arrayOrderingSrvMock = {};

  const baseUrlSrvMock = {
    getRestApiBase: function() {
      return 'http://localhost:8080';
    },
  };

  beforeEach(angular.mock.inject(function($controller, $rootScope, $window, $http) {
    rootScope = $rootScope;
    scope = $rootScope.$new();
    window = $window;
    http = $http;
    $controller('MainCtrl', {
      $scope: scope,
      $rootScope: rootScope,
      $window: window,
      arrayOrderingSrv: arrayOrderingSrvMock,
      $http: http,
      baseUrlSrv: baseUrlSrvMock,
      CrossControllerDataTransfer: CCDTMock,
    });
  }));

  it('should init correctly', function() {
    expect(rootScope.debugLVL).toEqual(5);
    expect(scope.asIframe).toEqual(false);
    const CCDTArray = [
      'setIframe',
      'setBodyClass',
      'resetBodyClass',
      'addBodyClass',
      'removeBodyClass',
      'setLookAndFeel',
    ];
    const keys = Object.keys(CCDTMock.callbacklist);
    expect(keys).toEqual(CCDTArray);
  });

  it('should attach "asIframe" to the scope and the default value should be false', function() {
    expect(scope.asIframe).toBeDefined();
    expect(scope.asIframe).toEqual(false);
  });

  it('should set the default value of "looknfeel to "default"', function() {
    expect(scope.looknfeel).toEqual('default');
  });

  it('should set "asIframe" flag to true and set correct class name', function() {
    CCDTMock.callbacklist.setIframe(true);
    expect(scope.asIframe).toEqual(true);
    expect(scope.bodyClassName).toEqual('body-as-iframe');
  });

  it('should use set/reset callbacks correctly', function() {
    CCDTMock.callbacklist.setBodyClass('test');
    expect(scope.bodyClassName).toEqual('test');
    CCDTMock.callbacklist.resetBodyClass();
    expect(scope.bodyClassName).toEqual('');
  });

  it('should use add/remove callbacks correctly', function() {
    CCDTMock.callbacklist.setBodyClass('test');
    CCDTMock.callbacklist.addBodyClass('class2');
    expect(scope.bodyClassName).toEqual('test class2');
    CCDTMock.callbacklist.removeBodyClass('test');
    expect(scope.bodyClassName).toEqual('class2');
  });
});
