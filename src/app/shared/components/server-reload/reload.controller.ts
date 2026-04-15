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
angular.module('zeppelinWebApp.comReload', [])
  .controller('ServerReloadCtrl', [
    '$scope',
    '$rootScope',
    '$window',
    '$location',
    'CrossControllerDataTransfer',
    ServerReloadCtrl
  ]);

function ServerReloadCtrl(
  $scope,
  $rootScope,
  $window,
  $location,
  CrossControllerDataTransfer,
  ) {

  const self = this;

  self.checkIframe = function() {
    $scope.asIframe = $window.location.href.indexOf('asIframe') > -1 || $location.search().asIframe;

    return $scope.asIframe;
  };

  self.showModal = function () {
    const myModalEl = document.getElementById('serverReloadNotification');
    let modal = bootstrap.Modal.getInstance(myModalEl);
    if(!modal) {
      modal = new bootstrap.Modal(myModalEl);
    }
    if(!$scope.asIframe){
      modal.show();
    }
  };

  $scope.reload = function(id) {


    $location.url('/');
    CrossControllerDataTransfer.triggerCallback('setIframe', false);
    $window.location.reload();
  };
  CrossControllerDataTransfer.setCallback('CheckIframe', self.checkIframe);
  CrossControllerDataTransfer.setCallback('showReloadModal', self.showModal);
}
