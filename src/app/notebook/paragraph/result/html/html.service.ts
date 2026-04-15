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
import {DisplayType} from '../../../../shared/objects/display/displayType';

angular.module('zeppelinWebApp.vizHTML', [])
  .service('vizHTMLService', [
    'vizRegisterService',
    vizHTMLService
  ]);

/** Every module should have a register service, that should provide info about the module:
 * inclusion : a string with absolute path to the HTML template. Used in ng-include
 * controllerName : a string with the name of the controller of the Viz
 * hasSettings: boolean flag, that defines if settings button is visible
 * compatibleList: a list of data types that are compatible with this viz.
 * -- in future, compatibleList should include the list of other viz that should be compatible with this one
 * id: string with viz ID
 * name: string that used for displaying the name
 * (optional) buttonIcon: string with HTML code that represents the icon for the switchviz button

 * default callbacks
 * getButton: callback function, that provides a button object for the viz switcher.
 * --If Viz has no other modules compatible, there is no need for button. It can return empty object.
 * isCompatible: callback that checks the compatible list and returns bool
 */

function vizHTMLService(
  vizRegisterService,
) {

  const self = this;
  self.inclusion = '/app/notebook/paragraph/result/html/html.html';
  self.controllerName = 'HTMLCtrl';

  self.hasSettings = false;
  self.compatibleList = [];
  self.id = 'HTML';
  self.name = 'HTML';

  self.getButton = function () {
    return {};
  };

  self.isCompatible = function (type) {
    return self.compatibleList.includes(DisplayType[type]);
  };

  //init: register in the hub service

  self.registry = vizRegisterService;
  self.registry.register(self.id, self);
}
