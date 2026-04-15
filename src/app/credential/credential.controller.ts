/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import angular from 'angular';


angular.module('zeppelinWebApp.credential',
  ['zeppelinWebApp.comToaster'])
  .controller('CredentialCtrl',
    ['$scope',
      '$rootScope',
      '$http',
      'baseUrlSrv',
      'ToasterService',
      CredentialController
    ]);

function CredentialController($scope,
                              $rootScope,
                              $http,
                              baseUrlSrv,
                              ToasterService,
                              ) {
  ToasterService.dismissAll();

  $scope.entityConfirm = {};

  $scope.credentialInfo = [];
  $scope.showAddNewCredentialInfo = false;
  $scope.availableInterpreters = [];
  $scope.show = -1;
  $scope.waiting = false;
  $scope.editable = {};

  $scope.entity = '';
  $scope.password = '';
  $scope.username = '';

  $scope.hasCredential = () => {
    return Array.isArray($scope.credentialInfo) && $scope.credentialInfo.length;
  };

  const getCredentialInfo = function() {
    $http.get(`${baseUrlSrv.getRestApiBase()}/credential`).then(
      function(response) {
        const returnedCredentials = response.data.body.userCredentials;
        for (const key in returnedCredentials) {
          $scope.credentialInfo.push({
            entity: key,
            password: returnedCredentials[key].password,
            username: returnedCredentials[key].username,
          });
        }
      }).catch(
      function(data, status, headers, config) {
        if (status === 401) {
          showToast('You do not have permission on this page', 'danger');
          setTimeout(function() {
            window.location = baseUrlSrv.getBase();
          }, 3000);
        }
        console.error('Error %o %o', status, data.message);
      }
    );
  };

  $scope.isValidCredential = function() {
    return $scope.entity.trim() !== '' && $scope.username.trim() !== '';
  };

  $scope.addNewCredentialInfo = function() {
    if (!$scope.isValidCredential()) {
      showToast('Username \\ Entity can not be empty.', 'danger');
      return;
    }

    const newCredential = {
      'entity': $scope.entity,
      'username': $scope.username,
      'password': $scope.password,
    };

    $http.put(`${baseUrlSrv.getRestApiBase()}/credential`, newCredential).then(
      function(data, status, headers, config) {
        showToast('Successfully saved credentials.', 'success');
        $scope.credentialInfo.push(newCredential);
        resetCredentialInfo();
        $scope.showAddNewCredentialInfo = false;
      }).catch(
        function(data, status, headers, config) {
          showToast('Error saving credentials', 'danger');
          console.error('Error %o %o', status, data.message);
        }
      );
  };

  const getAvailableInterpreters = function() {
    $http.get(`${baseUrlSrv.getRestApiBase()}/interpreter/setting`).then(
      function(response) {
        for(const interpreter of response.data.body) {
          const name = interpreter.name;
          const group = interpreter.group;
          $scope.availableInterpreters.push(
            `${name}.${group}`
          );
        }
        (angular.element('#entityname') as any).autocomplete({
          source: $scope.availableInterpreters,
          select: function(event, selected) {
            $scope.entity = selected.item.value;
            return false;
          },
        });
      }).catch(
      function(data, status, headers, config) {
        showToast('Something went wrong, please check the console', 'danger');
        console.error('Error %o %o', status, data.message);
      }
    );
  };

  $scope.toggleAddNewCredentialInfo = function() {
    if ($scope.showAddNewCredentialInfo) {
      $scope.showAddNewCredentialInfo = false;
    } else {
      $scope.showAddNewCredentialInfo = true;
    }
  };

  $scope.cancelCredentialInfo = function() {
    $scope.showAddNewCredentialInfo = false;
    resetCredentialInfo();
  };

  const resetCredentialInfo = function() {
    $scope.entity = '';
    $scope.username = '';
    $scope.password = '';
  };

  $scope.copyOriginCredentialsInfo = function(item) {
    showToast('Since entity is a unique key, you can edit only username & password', 'info');
    $scope.editable = angular.copy(item);
  };

  $scope.updateCredentialInfo = function() {

    const data = $scope.editable;
    if (!data.username || !data.password) {
      showToast('Username \\ Password can not be empty.', 'danger');
      return false;
    }
    const entity = data.entity;

    const credential = {
      entity: entity,
      username: data.username,
      password: data.password,
    };
    $scope.waiting = true;
    $http.put(`${baseUrlSrv.getRestApiBase()}/credential/`, credential).then(
      function(data, status, headers, config) {
        const index = $scope.credentialInfo.findIndex((elem) => elem.entity === entity);
        $scope.credentialInfo[index] = credential;
        $scope.waiting = false;
        $scope.show = -1;
        return true;
      }).catch(
      function(data, status, headers, config) {
        showToast('We could not save the credential', 'danger');
        console.error('Error %o %o', status, data.message);
        $scope.waiting = false;
        $scope.show = -1;
      }
    );
    return false;
  };

  $scope.removeCredentialInfo = function(entity) {
    $scope.entityConfirm = entity;

    const myModalEl = document.getElementById('removeCredentialModal');
    let modal = bootstrap.Modal.getInstance(myModalEl);
    if(!modal) {
      modal = new bootstrap.Modal(myModalEl);
    }
    modal.show();
  };

  $scope.removeCredentialInfoConfirm = function () {

    $http.delete(`${baseUrlSrv.getRestApiBase()}/credential/${$scope.entityConfirm}`)
      .then(
        function(data, status, headers, config) {
          const index = $scope.credentialInfo.findIndex((elem) => elem.entity === $scope.entityConfirm);
          $scope.credentialInfo.splice(index, 1);

          const myModalEl = document.getElementById('removeCredentialModal');
          const modal = bootstrap.Modal.getInstance(myModalEl);
          modal.hide();
          $scope.show = -1;
        }).catch(
        function(data, status, headers, config) {
          //showToast(data.message, 'danger');
          //showToast("Something went wrong, please check the console", 'danger');
          console.error('Error %o %o', status, data.message);
        }
      );
  };

  $scope.removeCredentialInfoClose = function () {
    const myModalEl = document.getElementById('removeCredentialModal');
    const modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();
  };

  function showToast(message, type) {
    ToasterService.addToast(message, type);
  }

  $scope.getCredentialDocsLink = function() {
    const currentVersion = $rootScope.zeppelinVersion;
    const isVersionOver0Point7 = currentVersion && currentVersion.split('.')[1] > 7;
    /*
     * Add '/setup' to doc link on the version over 0.7.0
     */
    return `https://zeppelin.apache.org/docs/${currentVersion}${
      isVersionOver0Point7 ? '/setup' : ''
    }/security/datasource_authorization.html`;
  };

  const init = function() {
    getAvailableInterpreters();
    getCredentialInfo();
  };

  init();
}
