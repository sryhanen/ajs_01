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
angular.module('zeppelinWebApp.comNoteClone', []).controller('NoteCloneCtrl', ['$scope', 'noteListFactory', '$routeParams', 'noteCloneService', 'websocketMsgSrv', NoteCloneCtrl]);

function NoteCloneCtrl(
  $scope,
  noteListFactory,
  $routeParams,
  noteCloneService,
  websocketMsgSrv
  ) {

  const vm = this;
  vm.notes = noteListFactory;
  vm.websocketMsgSrv = websocketMsgSrv;
  vm.noteCloneService = noteCloneService;
  $scope.note = {};
  $scope.interpreterSettings = {};
  $scope.note.defaultInterpreter = null;

  $scope.cloneNoteClick = function() {
    vm.handleNameEnter();
  };

  $scope.closeModal = function() {
    vm.close();
  };

  $scope.checkEnter = function(keyEvent) {
    if(keyEvent.keyCode === 13) {
      vm.handleNameEnter();
    }
  };

  $scope.setName = function() {
    if(!vm.noteCloneService.nameSet){
      if(vm.noteCloneService.name){
        $scope.note.notename = vm.cloneNoteName();
      }
      vm.noteCloneService.nameSetted();
    }
  };

  vm.close = function() {
    const myModalEl = document.getElementById('noteCloneModal');
    const modal = bootstrap.Modal.getInstance(myModalEl);

    modal.hide();
  };

  vm.handleNameEnter = function() {
    vm.createNote();
    vm.close();
  };

  vm.createNote = function() {
    const noteId = $routeParams.noteId;
    vm.websocketMsgSrv.cloneNote(noteId, $scope.note.notename);
  };

  vm.extractPath = function () {
    const origID = $routeParams.noteId;
    let path = '';
    angular.forEach(vm.notes.flatList, function(note) {
      if(note.id === origID) {
        path = note.path.substr(0,note.path.lastIndexOf('/')+1);
      }
    });
    return path;
  };

  vm.cloneNoteName = function() {
    let copyCount = 1;
    let newCloneName = '';
    const source = vm.noteCloneService.name;
    const lastIndex = source.lastIndexOf(' ');
    const endsWithNumber = !!source.match('^.+?\\s\\d$');
    const noteNamePrefix = endsWithNumber ? source.substr(0, lastIndex) : source;
    const regexp = new RegExp(`^${noteNamePrefix} .+`);

    angular.forEach(vm.notes.flatList, function(noteName) {

      noteName = noteName.path;

      if (noteName.match(regexp)) {
        let lastCopyCount = noteName.substr(lastIndex).trim();
        newCloneName = noteNamePrefix;
        lastCopyCount = parseInt(lastCopyCount);
        if (copyCount <= lastCopyCount) {
          copyCount = lastCopyCount + 1;
        }
      }
    });

    if (!newCloneName) {
      newCloneName = source;
    }
    const path = vm.extractPath();
    const finalNoteName = `${path + newCloneName} ${copyCount}`;

    return finalNoteName;
  };

}
