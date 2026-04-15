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
//import template from './configuration.html';

describe('Controller: Configuration', function() {
  beforeEach(angular.mock.module('zeppelinWebApp.configuration'));
  let template2;

  const baseUrlSrvMock = {getRestApiBase: () => ''};

  let ctrl; // controller instance
  let $scope;
  let $compile;
  let $controller; // controller generator
  let $httpBackend;
  let $templateCache;

  beforeEach(angular.mock.inject((_$controller_, _$rootScope_, _$compile_, _$httpBackend_, _$templateCache_) => {
    $scope = _$rootScope_.$new();
    $compile = _$compile_;
    $controller = _$controller_;
    $httpBackend = _$httpBackend_;
    $templateCache = _$templateCache_;

    template2 = $templateCache.get('/app/configuration/configuration.html');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should get configuration initially', () => {
    const conf = {'conf1': 'value1'};
    ctrl = $controller('ConfigurationCtrl', {$scope: $scope, baseUrlSrv: baseUrlSrvMock});
    expect(ctrl).toBeDefined();

    $httpBackend
      .when('GET', '/configurations/all')
      .respond({body: conf});
    $httpBackend.expectGET('/configurations/all');
    $httpBackend.flush();

    expect($scope.configurations).toEqual(conf); // scope is updated after $httpBackend.flush()
  });

  it('should render list of configurations as the sorted order', () => {
    $scope.configurations = {
      'zeppelin.server.port': '8080',
      'zeppelin.server.addr': '0.0.0.0',
    };
    const elem = $compile(template2)($scope);
    $scope.$digest();
    const tbody = elem.find('tbody');
    const tds = tbody.find('td');

    // should be sorted
    expect(tds[0].innerText.trim()).toBe('zeppelin.server.addr');
    expect(tds[1].innerText.trim()).toBe('0.0.0.0');
    expect(tds[2].innerText.trim()).toBe('zeppelin.server.port');
    expect(tds[3].innerText.trim()).toBe('8080');
  });//
});
