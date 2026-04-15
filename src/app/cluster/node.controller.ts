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
import './node.css';


angular.module('zeppelinWebApp.node',[]).controller('NodeCtrl', ['$scope', '$routeParams', '$http', 'baseUrlSrv', 'ToasterService', NodeCtrl]);

function NodeCtrl($scope,
                  $routeParams,
                  $http,
                  baseUrlSrv,
                  ToasterService,
                  ) {
  $scope.nodeName = $routeParams.nodeName;
  $scope.intpName = $routeParams.intpName;
  $scope.intpProcesses = [];
  $scope.pagination = {
    currentPage: 1,
    itemsPerPage: 10,
    maxPageCount: 5,
  };
  if ($scope.intpName !== null && $scope.intpName !== '' && $scope.intpName !== 'all') {
    $scope.searchNode = $scope.intpName;
  } else {
    $scope.searchNode = '';
  }
  $scope.filteredProcesses=$scope.intpProcesses;
  $scope.nodeFilter = function(intpProcess) {
    return intpProcess.properties.INTP_PROCESS_NAME.indexOf($scope.searchNode) !== -1;
  };
  ToasterService.dismissAll();

  $scope.getProgressInCurrentPage = function(pros) {
    $scope.filteredProcesses = pros;
    const cp = $scope.pagination.currentPage;
    const itp = $scope.pagination.itemsPerPage;
    return pros.slice((cp - 1) * itp, cp * itp);
  };

  const init = function() {
    $http.get(`${baseUrlSrv.getRestApiBase()}/cluster/node/${$scope.nodeName}/${$scope.intpName}`).then(
      function(response) {
        $scope.intpProcesses = response.data.body;
      }).catch(function(data, status, headers, config) {
        if (status === 401) {
          ToasterService.addToast('You don\'t have permission on this page', 'Danger');
          setTimeout(function() {
            window.location = baseUrlSrv.getBase();
          }, 3000);
        }
        console.error('Error %o %o', status, data.message);
      });
  };

  init();
}
