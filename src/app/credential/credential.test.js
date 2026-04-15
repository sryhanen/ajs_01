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

describe('Controller: Credential', function() {
  beforeEach(angular.mock.module('zeppelinWebApp.credential'));

  const baseUrlSrvMock = {getRestApiBase: () => ''};

  let $scope;
  let $controller; // controller generator
  let $httpBackend;

  beforeEach(angular.mock.inject((_$controller_, _$rootScope_, _$compile_, _$httpBackend_) => {
    $scope = _$rootScope_.$new();
    $controller = _$controller_;
    $httpBackend = _$httpBackend_;
  }));

  function createController() {
    return $controller('CredentialCtrl',
      {$scope: $scope, baseUrlSrv: baseUrlSrvMock}
    );
  }

  const credentialResponse = {'spark.testCredential': {username: 'user1', password: 'password1'}};
  const interpreterResponse = [
    {'name': 'spark', 'group': 'spark'},
    {'name': 'md', 'group': 'md'},
  ]; // simplified

  function setupInitialization(credentialRes, interpreterRes) {
    // requests should follow the exact order
    $httpBackend
      .when('GET', '/interpreter/setting')
      .respond({body: interpreterRes});
    $httpBackend.expectGET('/interpreter/setting');
    $httpBackend
      .when('GET', '/credential')
      .respond({body: {userCredentials: credentialRes}});
    $httpBackend.expectGET('/credential');

    // should flush after calling this function
  }

  it('should get available interpreters and credentials initially', () => {
    const ctrl = createController();
    expect(ctrl).toBeDefined();

    setupInitialization(credentialResponse, interpreterResponse);
    $httpBackend.flush();

    expect($scope.credentialInfo).toEqual(
      [{entity: 'spark.testCredential', username: 'user1', password: 'password1'}]
    );
    expect($scope.availableInterpreters).toEqual(
      ['spark.spark', 'md.md']
    );

    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should toggle using toggleAddNewCredentialInfo', () => {
    createController();

    expect($scope.showAddNewCredentialInfo).toBe(false);
    $scope.toggleAddNewCredentialInfo();
    expect($scope.showAddNewCredentialInfo).toBe(true);
    $scope.toggleAddNewCredentialInfo();
    expect($scope.showAddNewCredentialInfo).toBe(false);
  });

  it('should check empty credentials using isInvalidCredential', () => {
    createController();

    $scope.entity = '';
    $scope.username = '';
    expect($scope.isValidCredential()).toBe(false);

    $scope.entity = 'spark1';
    $scope.username = '';
    expect($scope.isValidCredential()).toBe(false);

    $scope.entity = '';
    $scope.username = 'user1';
    expect($scope.isValidCredential()).toBe(false);

    $scope.entity = 'spark';
    $scope.username = 'user1';
    expect($scope.isValidCredential()).toBe(true);
  });

  it('should be able to add credential via addNewCredentialInfo', () => {
    const ctrl = createController();
    expect(ctrl).toBeDefined();
    setupInitialization(credentialResponse, interpreterResponse);

    // when
    const newCredential = {entity: 'spark.sql', username: 'user2', password: 'password2'};

    $httpBackend
      .when('PUT', '/credential', newCredential)
      .respond({});
    $httpBackend.expectPUT('/credential', newCredential);

    $scope.entity = newCredential.entity;
    $scope.username = newCredential.username;
    $scope.password = newCredential.password;
    $scope.addNewCredentialInfo();

    $httpBackend.flush();

    expect($scope.credentialInfo[1]).toEqual(newCredential);

    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });


});
