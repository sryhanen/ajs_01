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
import {AnsiUp} from 'ansi_up';
const AnsiUpConverter = new AnsiUp();

angular.module('zeppelinWebApp.vizText')
  .directive('callback', [callbackDir]
  )
  .controller('TextCtrl', [
    '$scope',
    'vizRegisterService',
    TextCtrl
  ]);

//this is a directive component, that will call initViz once Angular finish loading it.
//more effective than endless checking loop to ensure that container is ready
function callbackDir() {
  return function (scope, element, attrs) {
    scope.initViz(element);
  };
}

function TextCtrl($scope, vizRegisterService) {
  $scope.loaded = false;
  let elem;
  let rendered = false;

  //WARNING: Legacy code
  //what does this even meant to do?
  const checkAndReplaceCarriageReturn = function(data) {
    const str1 = data.replace(/\r\n/g, '\n');
    if (/\r/.test(str1)) {
      let newGenerated = '';
      const strArr = str1.split('\n');
      for (const str of strArr) {
        if (/\r/.test(str)) {
          const splitCR = str.split('\r');
          newGenerated += `${splitCR[splitCR.length - 1]}\n`;//why???
          // This pushes only the last chunk of data back
        } else {
          newGenerated += `${str}\n`;
        }
      }
      // remove last "\n" character
      return newGenerated.slice(0, -1);
    } else {
      return str1;
    }
  };

  const render = function (){
    try {
      const generated = checkAndReplaceCarriageReturn($scope.data);
      const escaped = AnsiUpConverter.ansi_to_html(generated);
      const divDOM = angular.element('<div></div>').html(escaped);
      elem.html(divDOM);
    }catch (e) {
      console.warn('Text element failed to render with: ', e);
      elem.html(`${e.stack}`);
    }
  };

  const refresh = function (data, refresh) {//haven't seen the refresh being used, but why not
    try {
      $scope.data = data;
      const generated = checkAndReplaceCarriageReturn(data);
      const escaped = AnsiUpConverter.ansi_to_html(generated);
      const divDOM = angular.element('<div></div>').html(escaped);
      if(refresh){
        elem.html(divDOM);
      }else{
        elem.append(divDOM);
      }
    }catch (e) {
      console.warn('Text element failed to render with: ', e);
      elem.html(`${e.stack}`);
    }
  };

  /** this function must be in every VIZ controller
  id = paragraph.id
  index = index of the result
  data = paragraph.results.msg[index].data
  vizConfig = paragraph.config.result[index].graph + stuff
  */
  $scope.initResult = function (id, index, data,  vizConfig) {
    //set up all data
    $scope.containerID = `${id}_${index}`;
    $scope.data = data;
    //all modules must set up an update callback at the register
    vizRegisterService.linkUpdateViz(id, index, refresh);
    $scope.loaded = true;

  };

  $scope.initViz = function (element) {
    //when ready - render
    if(!rendered){
      const vizID = `${$scope.containerID}_viz`;
      element[0].id = vizID;
      elem = element;
      rendered = true;
      render();

    }
  };

}
