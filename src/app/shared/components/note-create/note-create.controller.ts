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

angular.module('zeppelinWebApp.comNoteCreate', [])
  .controller('NoteCreateCtrl', [
    '$scope',
    'noteListFactory',
    '$routeParams',
    'websocketMsgSrv',
    'CrossControllerDataTransfer',
    'noteCreateService',
    NoteCreateCtrl
  ]);

const re = /^[A-Z0-9a-z\ \-\_\/]{1,}$/m;
function NoteCreateCtrl(
  $scope,
  noteListFactory,
  $routeParams,
  websocketMsgSrv,
  CrossControllerDataTransfer,
  noteCreateService) {

  const vm = this;
  vm.clone = false;
  vm.notes = noteListFactory;
  vm.websocketMsgSrv = websocketMsgSrv;
  vm.noteCreateService = noteCreateService;
  $scope.note = {};
  $scope.interpreterSettings = {};
  $scope.note.defaultInterpreter = null;
  $scope.alert = null;
  $scope.processing = false;
  $scope.validator = true;
  $scope.shortName = false;
  $scope.longName = false;

  $scope.createNoteClick = function() {
    vm.createNote();
    $scope.processing = true;
  };

  $scope.closeNote = function() {
    vm.close();
  };

  $scope.checkEnter = function(keyEvent) {

    if($scope.note.notename && $scope.note.notename.length > 0){
      if(keyEvent.keyCode === 13 && $scope.validator && !$scope.longName && !$scope.shortName ) {
        vm.createNote();
      }
    }else{
      $scope.validator = true;
      $scope.shortName = true;
    }

  };

  $scope.validate = function() {
    if ($scope.note.notename && $scope.note.notename.length > 0){
      const notePath = $scope.note.notename;
      let pos = notePath.lastIndexOf('/');
      if (pos < 0 ){
        pos = 0;
      }
      const name = notePath.slice(pos);


      $scope.validator = re.test($scope.note.notename);
      $scope.longName = name.length > 90;
      $scope.shortName = $scope.note.notename.length <= 0;

    }else {
      $scope.validator = true;
      $scope.shortName = true;
    }
  };

  vm.close = function() {
    const myModalEl = document.getElementById('noteCreateModal');
    const modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();
  };

  vm.callbackSuccess = function(){
    $scope.processing = false;
    $scope.alert = null;
    $scope.note.notename = '';
    vm.close();
  };

  vm.callbackFail = function (error){
    $scope.alert = error;
    $scope.processing = false;
  };

  CrossControllerDataTransfer.setCallback('CreateNoteSuccess', vm.callbackSuccess);
  CrossControllerDataTransfer.setCallback('CreateNoteFail', vm.callbackFail);

  vm.createNote = function() {
    let defaultInterpreterGroup = '';
    if ($scope.note.defaultInterpreter !== null) {
        defaultInterpreterGroup = $scope.note.defaultInterpreter.name;
    }
    vm.websocketMsgSrv.createNotebook($scope.note.notename, defaultInterpreterGroup);
    $scope.note.defaultInterpreter = $scope.interpreterSettings[0];
  };

  $scope.setName = function() {


    if(!vm.noteCreateService.nameSet){
      if(vm.noteCreateService.path){
        $scope.note.notename = vm.newNoteName(vm.noteCreateService.path);
      }
      vm.noteCreateService.nameSetted();
    }
  };

  vm.newNoteName = function(path) {
    let newCount = 1;
    angular.forEach(vm.notes.flatList, function(noteName) {
      noteName = noteName.path;
      if (noteName.match(/^\/Untitled Note [0-9]*$/)) {
        const lastCount = noteName.substr(15) * 1;
        if (newCount <= lastCount) {
          newCount = lastCount + 1;
        }
      }
    });
    return `${path ? `${path}/` : ''}Untitled Note ${newCount}`;
  };

  $scope.$on('interpreterSettings', function(event, data) {
    $scope.interpreterSettings = data.interpreterSettings;
    // initialize default interpreter with Spark interpreter
    $scope.note.defaultInterpreter = data.interpreterSettings[0];
  });
}
