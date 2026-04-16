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
/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import angular from 'angular';
import 'headroom.js';
import 'headroom.js/dist/angular.headroom';
import 'scrollmonitor/scrollMonitor.js';
import 'angular-viewport-watch/angular-viewport-watch.js';
import {AuthenticationServiceImpl} from './shared/services/authenticationServiceImpl';

const requiredModules = [
  'ngCookies',
  'ngAnimate',
  'ngRoute',
  'ngSanitize',
  'ui.ace',
  'as.sortable',
  'ngTouch',
  'ngDragDrop',
  'ngResource',
  'angularViewportWatch',

  //zeppelin app modules
  'zeppelinWebApp.notebook',
  'zeppelinWebApp.node',
  'zeppelinWebApp.cluster',
  'zeppelinWebApp.configuration',
  'zeppelinWebApp.credential',
  'zeppelinWebApp.home',
  'zeppelinWebApp.interpreter',
  'zeppelinWebApp.job',
  'zeppelinWebApp.jobManager',
  'zeppelinWebApp.paragraph',
  'zeppelinWebApp.paragraphLink',
  'zeppelinWebApp.saveAs',

  //refactor
  'zeppelinWebApp.vizRegister',
  'zeppelinWebApp.vizBarchart', //new viz goes here. Need some automatic upload
  'zeppelinWebApp.vizPiechart',
  'zeppelinWebApp.vizLinechart',
  'zeppelinWebApp.vizAreachart',
  'zeppelinWebApp.vizScatterchart',
  'zeppelinWebApp.vizNetwork',
  'zeppelinWebApp.vizHTML',
  'zeppelinWebApp.vizTable',
  'zeppelinWebApp.vizJsonTable',
  'zeppelinWebApp.vizText',
  'zeppelinWebApp.vizAngular',
  'zeppelinWebApp.newResult',
  'zeppelinWebApp.pivotTransformation',
  'zeppelinWebApp.columnselectorTransformation',
  'zeppelinWebApp.tableParser',
  'zeppelinWebApp.networkParser',

  //components
  'zeppelinWebApp.comArrayOrdering',
  'zeppelinWebApp.comBaseURL',
  'zeppelinWebApp.comCCDT',
  'zeppelinWebApp.comInterpreterSettings',
  'zeppelinWebApp.comInterpreterPage',
  'zeppelinWebApp.comJob',
  'zeppelinWebApp.comLogin',
  'zeppelinWebApp.comNavbar',
  'zeppelinWebApp.comNgEnter',
  'zeppelinWebApp.comNgEscape',
  'zeppelinWebApp.comNoteAction',
  'zeppelinWebApp.comNoteClear',
  'zeppelinWebApp.comNoteClone',
  'zeppelinWebApp.comNoteCommit',
  'zeppelinWebApp.comNoteCreate',
  'zeppelinWebApp.comNoteDelete',
  'zeppelinWebApp.comNoteExport',
  'zeppelinWebApp.comNoteImport',
  'zeppelinWebApp.comNoteList',
  'zeppelinWebApp.comParagraphDelete',
  'zeppelinWebApp.comNotePermissions',
  'zeppelinWebApp.comNoteRename',
  'zeppelinWebApp.comNoteRestore',
  'zeppelinWebApp.comNoteRun',
  'zeppelinWebApp.comReload',
  'zeppelinWebApp.comToaster',
  'zeppelinWebApp.comDragdrop',
];

// headroom should not be used for CI, since we have to execute some integration tests.
// otherwise, they will fail.
if (!process.env.BUILD_CI) {
  requiredModules.push('headroom');
}

angular.module('zeppelinWebApp', requiredModules)
  .filter('breakFilter', function() {
    return function(text) {
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!text) {
        return text.replace(/\n/g, '<br />');
      }
    };
  })
  .config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
  }])
  .config(['$httpProvider', '$routeProvider', '$provide', function($httpProvider, $routeProvider, $provide) {
    $provide.factory('httpInterceptor', ['$q', '$rootScope', function($q, $rootScope) {
      return {
        'responseError': function(rejection) {
          if (rejection.status === 405) {
            const data = {info : ''};
            $rootScope.$broadcast('session_logout', data);
          }
          $rootScope.$broadcast('httpResponseError', rejection);
          return $q.reject(rejection);
        },
      };
    }]);
    $httpProvider.interceptors.push('httpInterceptor');
    $httpProvider.defaults.withCredentials = true;
    $routeProvider
      .when('/', {
        templateUrl: '/app/home/home.html',
      })
      .when('/notebook/:noteId', {
        templateUrl: '/app/notebook/notebook.html',
        controller: 'NotebookCtrl',
      })
      .when('/notebook/:noteId/paragraph?=:paragraphId', {
        templateUrl: '/app/notebook/notebook.html',
        controller: 'NotebookCtrl',
      })
      .when('/notebook/:noteId/paragraph/:paragraphId?', {
        templateUrl: '/app/notebook/paragraph-link.html',
        controller: 'ParagraphLinkCtrl',
      })
      .when('/notebook/:noteId/revision/:revisionId', {
        templateUrl: '/app/notebook/notebook.html',
        controller: 'NotebookCtrl',
      })
      .when('/jobmanager', {
        templateUrl: '/app/jobmanager/jobmanager.html',
        controller: 'JobManagerCtrl',
      })
      .when('/interpreter', {
        templateUrl: '/app/interpreter/interpreter.html',
        controller: 'InterpreterCtrl',
      })
      .when('/credential', {
        templateUrl: '/app/credential/credential.html',
        controller: 'CredentialCtrl',
      })
      .when('/configuration', {
        templateUrl: '/app/configuration/configuration.html',
        controller: 'ConfigurationCtrl',
      })
      .when('/cluster', {
        templateUrl: '/app/cluster/cluster.html',
        controller: 'ClusterCtrl',
      })
      .when('/cluster/:nodeName/:intpName', {
        templateUrl: '/app/cluster/node.html',
        controller: 'NodeCtrl',
      })
      .otherwise({
        redirectTo: '/',
      });
  }])
  .run(['$rootScope', 'authenticationServiceImpl', '$location', function($rootScope, authenticationServiceImpl: AuthenticationServiceImpl, $location) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      if (!$rootScope.ticket && next.$$route && !next.$$route.publicAccess) {
        const oldPath = $location.search() && $location.search()['ref'] || $location.path();
        $location.path('/').search('ref', oldPath);
      }
    });
    const authentication = authenticationServiceImpl.authentication();
    if(!authentication.isStub()){
      $rootScope.ticket = authentication.ticket();
      authentication.redirect();
    }
    else{
      $rootScope.ticket = undefined;
    }
    angular.element('#pre-loader').fadeOut();
  }])
  .constant('TRASH_FOLDER_ID', '~Trash');

