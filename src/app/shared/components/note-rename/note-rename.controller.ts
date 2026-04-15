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

angular.module('zeppelinWebApp.comNoteRename', []).controller('NoteRenameCtrl', ['$scope', 'noteRenameService', NoteRenameController]);

function NoteRenameController($scope,
                              noteRenameService,
                              ) {

  const self = this;

  $scope.params = {newName: ''};
  $scope.isValid = true;

  $scope.rename = function() {

    noteRenameService.options.callback($scope.params.newName);
    self.closeModal();
  };

  //this does not work. Alas. To find a better solution in future.
  //$scope.params.newName = noteRenameService.options.oldName || '';

  $scope.validate = function() {

    if(noteRenameService.options.validator) {

      $scope.isValid = noteRenameService.options.validator($scope.params.newName);

    }else {

      $scope.isValid = defaultValidator($scope.params.newName);

    }

  };

  function defaultValidator(str) {
    return !!str.trim();
  }

  $scope.close = function() {
    self.closeModal();
  };

  self.closeModal = function (){
    const myModalEl = document.getElementById('noteRenameModal');
    const modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();
    $scope.params.newName = '';
  };

  $scope.triggerMerge = function (){
    noteRenameService.callback();
    const myModalEl = document.getElementById('noteRenameFolderMergeModal');
    const modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();
  };

  $scope.closeMerge = function (){
    const myModalEl = document.getElementById('noteRenameFolderMergeModal');
    const modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();
  };

}
