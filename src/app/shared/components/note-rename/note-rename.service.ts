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

angular.module('zeppelinWebApp.comNoteRename').service('noteRenameService', ['$rootScope', NoteRenameService]);

function NoteRenameService($rootScope) {

  const self = this;
  self.options = {};
  self.callback = function() {
    console.warn('No callback bound');
  };
  /**
   * <options schema>
   * title: string - Modal title
   * oldName: string - name to initialize input
   * callback: (newName: string)=>void - callback onButtonClick
   * validator: (str: string)=>boolean - input validator
   */
  self.openRenameModal = function(options) {
    //$rootScope.$broadcast('openRenameModal', options);

    const myModalEl = document.getElementById('noteRenameModal');
    let modal = bootstrap.Modal.getInstance(myModalEl);
    if(!modal) {
      modal = new bootstrap.Modal(myModalEl);
    }
    modal.show();
    self.options = options;
  };

  self.openMerge = function(options) {

    const oldModal = document.getElementById('noteRenameModal');
    const modal = bootstrap.Modal.getInstance(oldModal);
    if(modal) {
      modal.hide();
    }
    const myModalEl = document.getElementById('noteRenameFolderMergeModal');
    let newModal = bootstrap.Modal.getInstance(myModalEl);
    if(!newModal) {
      newModal = new bootstrap.Modal(myModalEl);
    }
    newModal.show();
    self.callback = options.callback;
  };

}
