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
describe('Controller: LoginCtrl', function() {

  let scope;
  let ctrl;
  let loginService;
  let location;
  let httpBackend;

  let template;
  let templateCache;
  let compile;

  const baseUrlSrvMock = {
    getRestApiBase: function() {
      return '/test';
    },
    getBase: function() {
      return {};
    },
  };

  beforeEach(angular.mock.module('zeppelinWebApp.comLogin'));

  beforeEach(angular.mock.inject(function($injector, $rootScope, $controller, $location, $httpBackend, $templateCache, $compile) {
    loginService = $injector.get('LoginService');
    location = $location;
    httpBackend = $httpBackend;
    location.path('/');
    scope = $rootScope.$new();

    templateCache = $templateCache;
    template = templateCache.get('/app/shared/components/login/login.html');
    compile = $compile;

    ctrl = $controller('LoginCtrl', {
      $scope: scope,
      loginService: loginService,
      $location: location,
      baseUrlSrv: baseUrlSrvMock,
    });
    spyOn(ctrl, 'closeModal').and.callFake(function () {
      return {};
    });
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('Cancelling in insufficient privileges modal should not redirect you to front page', function() {
    location.path('/test');

    scope.closeNoLogin();

    expect(location.path()).toEqual('/test');
  });

  it('should be disabled only after sending login request and not after receiving any response', function() {
    location.path('/');
    scope.loginParams = {userName: 'Tester', password: 'Test'};
    httpBackend
      .when('POST', '/test/login')
      .respond(200, {body: 'ticket'});
    expect(scope.SigningIn).toBeFalsy();
    scope.login();
    expect(scope.SigningIn).toBeTruthy();
    httpBackend.expectPOST('/test/login');
    httpBackend.flush();
    expect(scope.SigningIn).toBeFalsy();
    //testing for error status
    httpBackend
      .when('POST', '/test/login')
      .respond(404, {body: 'error'});
    scope.login();
    expect(scope.SigningIn).toBeTruthy();
    httpBackend.expectPOST('/test/login');
    httpBackend.flush();
    expect(scope.SigningIn).toBeFalsy();
  });

  it('should compile and simulate modal operations to check if input is disabled during login', function() {
    location.path('/');
    scope.loginParams = {userName: 'Tester', password: 'Test'};
    httpBackend
      .when('POST', '/test/login')
      .respond(200, {body: 'ticket'});


    const elem = compile(template)(scope);
    scope.$digest();

    const form = elem.find('#userName');
    const form2 = elem.find('#password');
    expect(form[0].disabled).toBeFalsy();
    expect(form2[0].disabled).toBeFalsy();


    scope.login();
    compile(template)(scope);
    httpBackend.expectPOST('/test/login');
    scope.$digest();
    expect(form[0].disabled).toBeTruthy();
    expect(form2[0].disabled).toBeTruthy();

    httpBackend.flush();

    compile(template)(scope);
    scope.$digest();
    expect(form[0].disabled).toBeFalsy();
    expect(form2[0].disabled).toBeFalsy();
  });

});
