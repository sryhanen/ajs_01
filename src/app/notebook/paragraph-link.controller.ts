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
import {isParagraphRunning} from './paragraph/paragraph.status';
import Paragraph from '../shared/interfaces/paragraph';

angular.module('zeppelinWebApp.paragraphLink', [
  'zeppelinWebApp.comBaseURL',
  'zeppelinWebApp.comCCDT',
])
  .controller('ParagraphLinkCtrl', [
    '$scope',
    '$route',
    '$routeParams',
    '$location',
    '$rootScope',
    'websocketMsgSrv',
    'baseUrlSrv',
    'LoginService',
    'CrossControllerDataTransfer',
    ParagraphLinkCtrl
  ]);

function ParagraphLinkCtrl(
  $scope,
  $route,
  $routeParams,
  $location,
  $rootScope,
  websocketMsgSrv,
  baseUrlSrv,
  LoginService,
  CrossControllerDataTransfer,
) {

  $scope.note = undefined;
  $scope.actionOnFormSelectionChange = true;
  $scope.editorToggled = true;
  $scope.tableToggled = false;
  $scope.viewOnly = false;
  $scope.noteFormTitle = null;
  $scope.paragraphWarningDialog = {};

  $scope.$watch('note', function(value) {
    let title;
    if (value) {
      title = value.name.substr(value.name.lastIndexOf('/') + 1, value.name.length);
      title += ' - Zeppelin';
    } else {
      title = 'Zeppelin';
    }
    $rootScope.pageTitle = title;
  }, true);

  /** Init the new controller */
  const initNotebook = function() {
    angular.element(document).click(function() {
      angular.element('.ace_autocomplete').hide();
    });
    websocketMsgSrv.getNote($routeParams.noteId);
  };

  initNotebook();

  $scope.paragraphOnDoubleClick = function(paragraphId) {
    $scope.$broadcast('doubleClickParagraph', paragraphId);
  };

  websocketMsgSrv.listConfigurations();

  $scope.isNoteRunning = function() {
    if (!$scope.note) {
      return false;
    }

    for (let i = 0; i < $scope.note.paragraphs.length; i++) {
      if (isParagraphRunning($scope.note.paragraphs[i])) {
        return true;
      }
    }

    return false;
  };

  $scope.$on('updateNote', function(event, name, config, info) {
    /** update Note name */
    if (name !== $scope.note.name) {

      $scope.note.name = name;
    }
    $scope.note.config = config;
    $scope.note.info = info;
  });

  $scope.isOwnerEmpty = function() {
    if ($scope.permissions.owners.length > 0) {
      for (let i = 0; i < $scope.permissions.owners.length; i++) {
        if ($scope.permissions.owners[i].trim().length > 0) {
          return false;
        } else if (i === $scope.permissions.owners.length - 1) {
          return true;
        }
      }
    } else {
      return true;
    }
  };

  $scope.showParagraphWarning = function(next) {
    LoginService.leave({
      callback: function() {
        let locationToRedirect = next['$$route']['originalPath'];
        Object.keys(next.pathParams).map((key) => {
          locationToRedirect = locationToRedirect.replace(`:${key}`,
            next.pathParams[key]);
        });
        $scope.allowLeave = true;
        $location.path(locationToRedirect);
      },
    });
  };

  /*
   ** $scope.$on functions below
   */

  $scope.$on('setNoteContent', function(event, note) {


    if (note === undefined) {


      return;
    }
    $scope.note = note;

    $scope.paragraphUrl = $routeParams.paragraphId;

    $scope.asIframe = true; //the result is always iframe;
    if(!$routeParams.asIframe){
      $routeParams.asIframe = true;
    }
    CrossControllerDataTransfer.triggerCallback('setIframe', $scope.asIframe);
    const singleParagraphCollection = [];
    $scope.note.paragraphs.map(paragraph => {
      if (paragraph.id === $scope.paragraphUrl){
        singleParagraphCollection.push(paragraph);
      }
    });
    if(singleParagraphCollection.length === 1){
      $scope.note.paragraphs = singleParagraphCollection;
    }
  });

  $scope.$on('$routeChangeStart', function(event, next, current) {
    if (!$scope.note || !$scope.note.paragraphs) {
      return;
    }
    if ($scope.note && $scope.note.paragraphs) {
      $scope.note.paragraphs.map((par) => {
        if ($scope.allowLeave === true) {
          return;
        }
        const thisScope = angular.element(
          `#${par.id}_paragraphColumn_main`).scope() as Paragraph;

        if (thisScope.dirtyText === undefined ||
          thisScope.originalText === undefined ||
          thisScope.dirtyText === thisScope.originalText) {
          return true;
        } else {
          event.preventDefault();
          $scope.showParagraphWarning(next);
        }
      });
    }
  });

  $scope.$on('$destroy', function() {
    angular.element(window).off('beforeunload');
  });
}
