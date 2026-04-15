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
angular.module('zeppelinWebApp.vizRegister', [])
  .service('vizRegisterService', [vizRegisterService]);

/**
 * this service registering all Viz modules that have registration service in them
 * it maintains a list of available viz modules and their instances with callbacks
 */
function vizRegisterService() {

  const self = this;
  /**
  template = collection of all avaiable viz modules
  instance = links to a created viz instances and their callbacks
  -- each instance has id, which is a paragraphID where result instance was created
  -- under ID of the paragraph there could be multiple results = instances, identified with corresponding index
  -- each instance should have update callbacks
   */
  self.storage = {template:{}, instance:{}};

  //put the viz module in the template list on init of the app
  self.register = function(name, callbackStack) {

    self.storage.template[name] = callbackStack;
  };

  //to prevent undefined causing crashes
  self.defaultInstance = function (id, index) {
    if (!self.storage.instance[id]){
      self.storage.instance[id] = [];
    }
    if (!self.storage.instance[id][index]){
      self.storage.instance[id][index] = {};
    }
  };

  //link a custom callback to the instance
  self.createLink = function (id, index, callbackname, callbackFunc) {

    self.defaultInstance(id, index);
    self.storage.instance[id][index][callbackname] = callbackFunc;
  };

  //specific callbacks
  //set by instance
  self.linkEmitConfig = function (id, index, callback) {
    self.defaultInstance(id, index);
    self.storage.instance[id][index].emitConfig = callback;
  };
  //set by result controller
  self.linkUpdateViz = function (id, index, callback) {
    self.defaultInstance(id, index);
    self.storage.instance[id][index].update = callback;
  };

  //try to update through update callback
  self.updateViz = function (id, index, data, config) {
    try{
      self.storage.instance[id][index].update(data, config);
      return true;
    }catch (e) {
      console.warn(`Error when updating viz: ${e.message}`);
      return false;
    }
  };

  //try to emit config through callback
  self.emitConfig = function (id, index, vizConf) {
    self.storage.instance[id][index].emitConfig(vizConf);
    return true;
  };

  //try to find viz of such name. If none found, return first in the list
  self.getViz = function(name) {
    if(self.storage.template[name]){
      return self.storage.template[name];
    }else{
      const list = self.getList();
      return self.storage.template[list[0]];
    }
  };

  //get list of available viz, compatible to the data type
  //if no type provided, get list of all avalable viz
  self.getList = function(type) {
    let list = [];
    if(type){
      Object.keys(self.storage.template).map(key =>{
        if (self.storage.template[key].isCompatible(type)){
          list.push(key);
        }
      });
    }else{
      list = Object.keys(self.storage.template);
    }
    return list;
  };

}
