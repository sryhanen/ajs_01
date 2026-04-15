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

angular.module('zeppelinWebApp.configuration', [
  'zeppelinWebApp.comToaster',
  'zeppelinWebApp.comBaseURL',
  'zeppelinWebApp.interpreter'
]).controller('ConfigurationCtrl', [
  '$scope',
  '$http',
  'baseUrlSrv',
  'ToasterService',
  '$rootScope',
  ConfigurationCtrl
]);

//could used struct, but why bother. This gives a correct translation to debug levels
const TitleSet = [
  'Only errors',
  'Errors and warnings',
  'Logging',
  'Allow info',
  'Allow all'
];

function ConfigurationCtrl($scope,
                           $http,
                           baseUrlSrv,
                           ToasterService,
                           $rootScope) {

  $scope.configrations = [];
  //defaults
  $scope.consoleLVL = $rootScope.debugLVL;
  $scope.consoleTitle = TitleSet[$scope.consoleLVL];
  ToasterService.dismissAll();

  const getConfigurations = function() {
    $http.get(`${baseUrlSrv.getRestApiBase()}/configurations/all`).then(
      function(response) {
        $scope.configurations = response.data.body;
      }).catch(
      function(data, status, headers, config) {
        if (status === 401) {
          ToasterService.addToast('You don\'t have permission on this page', 'Danger');
          setTimeout(function() {
            window.location = baseUrlSrv.getBase();
          }, 3000);
        }
        console.error('Error %o %o', status, data.message);
      }
    );
  };

  const init = function() {
    getConfigurations();
    $scope.consoleLVL = $rootScope.debugLVL;
    //sets it on initialization from the root scope, not backwards, to ensure the defaults
  };

  $scope.consoleChanged = function () {
    //sets the title to refresh the scope
    $scope.consoleTitle = TitleSet[$scope.consoleLVL];
    $rootScope.debugLVL = $scope.consoleLVL;
    //uncomment for debug. It must be error level, since all other levels will be disabled by default
    //console.error("Console level changed: ", $rootScope.debugLVL);
  };

  init();
}
