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
import angular from 'angular';

import _ from 'lodash';

angular.module('zeppelinWebApp.comInterpreterSettings', []).controller('InterpreterSettingCtrl', ['$scope', 'InterpreterSettingService', '$http', 'baseUrlSrv', InterpreterSettingCtrl]);

function InterpreterSettingCtrl(
  $scope,
  InterpreterSettingService,
  $http,
  baseUrlSrv,
) {

  const vm = this;
  vm.InterpreterSettingService = InterpreterSettingService;

  $scope.closeModal = function(id) {
    vm.close(id);
  };

  vm.close = function(id) {
    const myModalEl = document.getElementById(id);
    const modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();
    $scope.restartError = false;
  };

  $scope.confirmRestartInterpreter = function() {

    const payload = {
      'noteId': vm.InterpreterSettingService.note.id,
    };
    const interpreter = vm.InterpreterSettingService.interpreter;
    $scope.modalWorking = true;


    $http.put(`${baseUrlSrv.getRestApiBase()}/interpreter/setting/restart/${interpreter.id}`, payload).then(
      function(response) {
        const index = _.findIndex($scope.interpreterSettings, {'id': interpreter.id});
        if(index >=0 ){
          $scope.interpreterSettings[index] = response.data.body;
        }
        else {
          console.warn('Interpreter id %o was not found in the interpreter settings', index);
        }
        $scope.modalWorking = false;
        vm.close('restartInterpreterModal');
      }).catch(
      function(data, status, headers, config) {
        console.error('Error %o %o', status, data.message);
        $scope.restartErrorMessage = `Error in restarting the interpreter: ${
          _.escape(status)} ${
          _.escape(data.statusText)} ${
          _.escape(data.message)}`;
        $scope.modalWorking = false;
        $scope.restartError = true;
      });
  };
}
