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
import _ from 'lodash';

angular.module('zeppelinWebApp.comNoteAction', ['zeppelinWebApp'])
  .service('noteActionService', [
    'websocketMsgSrv',
    '$location',
    'noteRenameService',
    'noteClearService',
    'noteCreateService',
    'noteRestoreService',
    'noteDeleteService',
    'noteListFactory',
    noteActionService
  ]);

function noteActionService(
                           websocketMsgSrv,
                           $location,
                           noteRenameService,
                           noteClearService,
                           noteCreateService,
                           noteRestoreService,
                           noteDeleteService,
                           noteListFactory,
                           ) {
  const vm = this;
  vm.noteClearService = noteClearService; //used to access and mock the logic with unit tests

  this.moveNoteToTrash = function(noteId, redirectToHome) {
    noteDeleteService.setCallback({
      callback: function() {
          websocketMsgSrv.moveNoteToTrash(noteId);
          if (redirectToHome) {
            $location.path('/');
          }
      },
      modalID: 'noteRemoveModal',
    });
  };

  this.moveFolderToTrash = function(folderId) {
    noteDeleteService.setCallback({
      callback: function() {
        websocketMsgSrv.moveFolderToTrash(folderId);
      },
      modalID: 'folderRemoveModal',
    });
  };

  this.removeNote = function(noteId, redirectToHome) {
    noteDeleteService.setCallback({
      callback: function() {
          websocketMsgSrv.deleteNote(noteId);
          if (redirectToHome) {
            $location.path('/');
          }
      },
      modalID: 'noteDeleteModal',
    });
  };

  this.removeFolder = function(folderId) {
    noteDeleteService.setCallback({
      callback: function() {
        websocketMsgSrv.removeFolder(folderId);
      },
      modalID: 'folderDeleteModal',
    });
  };

  this.restoreNoteAction = function(noteID) {
    noteRestoreService.setCallback({
      callback: function() {
        websocketMsgSrv.restoreNote(noteID);
      },
      modalID: 'noteRestoreModal',
    });
  };

  this.restoreFolderAction = function(folderPath) {
    noteRestoreService.setCallback({
      callback: function() {
        websocketMsgSrv.restoreFolder(folderPath);
      },
      modalID: 'folderRestoreModal',
    });
  };

  this.restoreAllAction = function() {
    noteRestoreService.setCallback({
      callback: function() {
        websocketMsgSrv.restoreAll();
      },
      modalID: 'noteRestoreAllModal',
    });
  };

  this.emptyTrash = function() {
    noteDeleteService.setCallback({
      callback: function() {
          websocketMsgSrv.emptyTrash();
      },
      modalID: 'noteDeleteAllModal',
    });
  };

  // this sets and updates the callback in the noteClearService.callback
  this.clearNote = function(noteId) {
    vm.noteClearService.openClearModal({
      callback: function() {
        websocketMsgSrv.clearAllParagraphOutput(noteId);
      },
      modalID: 'noteClearOutputModal',
    });
  };

  this.renameNote = function(noteId, notePath) {
    noteRenameService.openRenameModal({
      title: 'Rename notebook',
      oldName: notePath,
      callback: function(newName) {
        websocketMsgSrv.renameNote(noteId, newName);
      },
    });
  };

  this.renameFolder = function(folderPath) {
    noteRenameService.openRenameModal({
      title: 'Rename folder',
      oldName: folderPath,
      callback: function(newName) {
        const newFolderPath = normalizeFolderId(newName);
        if (_.has(noteListFactory.flatFolderMap, newFolderPath)) {
          noteRenameService.openMerge({
            callback: function() {
              websocketMsgSrv.renameFolder(folderPath, newFolderPath);
            },
          });
        } else {
          websocketMsgSrv.renameFolder(folderPath, newFolderPath);
        }
      },
    });
  };

  function normalizeFolderId(folderId) {
    folderId = folderId.trim();

    while (folderId.indexOf('\\') > -1) {
      folderId = folderId.replace('\\', '/');
    }

    while (folderId.indexOf('///') > -1) {
      folderId = folderId.replace('///', '/');
    }

    folderId = folderId.replace('//', '/');

    if (folderId === '/') {
      return '/';
    }

    if (folderId[0] === '/') {
      folderId = folderId.substring(1);
    }

    if (folderId.slice(-1) === '/') {
      folderId = folderId.slice(0, -1);
    }

    return folderId;
  }
}
