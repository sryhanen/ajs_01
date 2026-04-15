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
angular.module('zeppelinWebApp.comDragdrop', [
  'zeppelinWebApp.comToaster',
])
  .controller('dragDropController', [
    '$scope',
    '$rootScope',
    'ToasterService',
    dragDropController
  ]);

function dragDropController(
  $scope,
  $rootScope,
  ToasterService,
) {
  //variables setup
  const vm = this;
  $scope.inputData = [];
  $scope.zoneCollection = [];
  $scope.aggregationExport = [];
  $scope.update = undefined;

  //init on component creation
  $scope.init = function (zones, columns, save) {

    $scope.inputData = columns; //neither index nor $$hashKey props are used, maybe remove from server?
    $scope.zoneCollection = zones; //prepared on the outer layer
    $scope.aggregationExport = ['sum', 'count', 'avg', 'min', 'max'];
    $scope.update = function (target = false){
      //if provided the correct UUID property as target, will remove the item with that UUID
      if(target){
        vm.removeItem(target);
      }

      save($scope.zoneCollection);
    };
  };
  //a template for the form
  const selectionDefault = {
    item: {
      name: 'Select',
      aggr: false,
    },
    field: {
      id: 'Select',
      aggr: false,
      content: [],
      limit: 0
    },
    aggr: 'Select',
  };

  //an optimized aggregation picker
  vm.chooseDefaultAggr = function (item, collection) {
    const occurances = $scope.aggregationExport.map(el =>{
      return 0;
    });
    collection.map(element =>{
      if (element.name === item.name){
        const position = $scope.aggregationExport.indexOf(element.aggr);
        if (position >= 0){
          occurances[position] = 1;
        }
      }
    });

    const candidate = occurances.indexOf(0);
    if (candidate >= 0){
      return $scope.aggregationExport[candidate];
    }else {
      return false;
    }
  };

  //in case any chage occurs without an update
  $scope.$watch('zoneCollection', function(value) {

    if(value){

      $scope.update();
    }
  });

  $scope.selectionToAdd = angular.copy(selectionDefault); //can be also reset after adding

  //used in UI
  $scope.setSelection = function (propName, propValue){
    $scope.selectionToAdd[propName] = propValue;
  };

  //used from button Add
  $scope.addSelection = function () {
    let selectedItem = undefined;
    $scope.inputData.map(item =>{
      if(item.name === $scope.selectionToAdd.item.name){
        selectedItem = angular.copy(item);
      }
    });

    if(!selectedItem){

      return; //no item found
    }
    selectedItem['UUID'] = Date.now();

    let error = false;
    $scope.zoneCollection.map(zone => {
      if (zone.id === $scope.selectionToAdd.field.id) {
        if (zone.aggr) {
          if (!$scope.aggregationExport.includes($scope.selectionToAdd.aggr)) {
            const suggest = vm.chooseDefaultAggr(selectedItem, zone.content);
            if (suggest) {
              selectedItem.aggr = suggest;
            } else {
              error = true;
              ToasterService.addToast('The field cannot be added, all aggreagation for that field are used', 'Danger');

            }
          } else {
            selectedItem.aggr = $scope.selectionToAdd.aggr;
          }
        }else{
          selectedItem.aggr = false;
        }
      }
    });
    if (!error){
      vm.addItem($scope.selectionToAdd.field.id, selectedItem);
      $scope.update();
    }
  };

  //transferred callback for drop-zone
  $scope.dragitem = function (zone, item) {
    if(zone.aggr){
      if (!$scope.aggregationExport.includes(item.aggr)) {
        const suggest = vm.chooseDefaultAggr(item, zone.content);
        if (suggest) {
          item.aggr = suggest;
        } else {
          ToasterService.addToast('The field cannot be added, all aggreagation for that field are used', 'Danger');
          return;
        }
      }
    }else{
      item.aggr = false;
    }
    const copy = JSON.parse(JSON.stringify(item));
    item.UUID = Date.now();
    //since this is UI, it is unlikely, that users can create two identical items in same millisecond
    //but if they do, problems may occur, like auto-deleting an extra item with same UUID
    const success = vm.addItem(zone.id, item, copy.UUID);
    if(success){
      $scope.update(copy.UUID); //update with removal
    }
  };

  //common code for adding an item. Private
  vm.addItem = function (zoneID, item, oldUUID = null) {

    let error = false;
    $scope.zoneCollection.map(zone =>{
      if (zone.id === zoneID){
        if(vm.checkDup(item, zone)){
          if(zone.limit === 0 || zone.content.length < zone.limit){
            zone.content.push(item);
          }else{
            error = true;
            if(oldUUID){
              vm.trySwap(oldUUID, zone.content[0].UUID);
            }else{
              const message = `The limit for this section is ${zone.limit} field(s).`;
              ToasterService.addToast(message, 'Warning');
            }
            $rootScope.$digest();
          }
        }else{
          error = true;
          ToasterService.addToast('You can\'t add duplicate fields in that section.', 'Warning');
        }
      }
    });
    return !error;
  };

  //swap can occur normally in scatter chart
  vm.trySwap = function (item1, item2) {

    let zoneIndex1 = undefined;
    let zoneIndex2 = undefined;
    $scope.zoneCollection.map((zone, index) =>{
      if(zone.content[0]){
        if(zone.content[0].UUID === item1 && zone.limit === 1){
          zoneIndex1 = index;
        }
        if(zone.content[0].UUID === item2 && zone.limit === 1){
          zoneIndex2 = index;
        }
      }
    });

    if(zoneIndex1 !== undefined && zoneIndex2 !== undefined){
      const copy = JSON.parse(JSON.stringify($scope.zoneCollection[zoneIndex1].content[0]));
      $scope.zoneCollection[zoneIndex1].content[0] = $scope.zoneCollection[zoneIndex2].content[0];
      $scope.zoneCollection[zoneIndex2].content[0] = copy;
      $scope.update();
    }else{
      const message = 'The limit for this section was exceeded.';
      ToasterService.addToast(message, 'Warning');
    }
  };

  //internal removing function. Private.
  vm.removeItem = function (ID) {

    $scope.zoneCollection.map(zone =>{
      zone.content.map((item,index) =>{
        if (item.UUID === ID){
          zone.content.splice(index, 1);
        }
      });
    });
  };

  //used in the X button in the fields
  $scope.removeItem = function (ID) {
    $scope.update(ID); //will call vm.removeItem by itself
  };

  //removes ALL content from zones to start over
  $scope.reset = function () {
    $scope.zoneCollection.map(zone => {
      zone.content = [];
    });
    $scope.update();
  };

  //change the aggregation if allowed
  $scope.changeAggr = function (zone, aggr, item) {

    let zoneIndex = undefined;
    $scope.zoneCollection.map((el, index) => {
      if (el.id === zone.id){
        zoneIndex = index;
      }
    });
    let itemIndex = undefined;
    $scope.zoneCollection[zoneIndex].content.map((element, index) =>{
      if (element.name === item.name && element.aggr === item.aggr){
        itemIndex = index;
      }
    });
    let allow = true;
    $scope.zoneCollection[zoneIndex].content.map(element =>{
      if (element.name === item.name && element.aggr === aggr){
        allow = false;
      }
    });

    if (allow){
      $scope.zoneCollection[zoneIndex].content[itemIndex].aggr = aggr;
      $scope.update();
    }else {
      ToasterService.addToast('The aggregation cannot be changed', 'Danger');
    }
  };

  //prevent duplicates
  vm.checkDup = function (item, zone) {
    let unique = true;
    zone.content.map(element =>{
      if (element.name === item.name ){
        if(zone.aggr){ //if aggregation is not allowed - it does not matter
          if(element.aggr === item.aggr){
            unique = false;
          }
        }else{
          unique = false;
        }
      }
    });

    return unique;
  };
}
