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
import angular, {IPostLink, IScope} from 'angular';
import {AngularObjectCollection} from '../angular2+/objects/angularObjectCollection/angularObjectCollection';
import {PushValue} from '../angular2+/objects/pushValue/pushValue';
import {PushValueImpl} from '../angular2+/objects/pushValue/pushValueImpl';
import {AngularObject} from '../angular2+/objects/angularObject/angularObject';

export class AngularPluginAjs implements IPostLink{
  static $inject = ['$compile', '$scope', '$element'];
  private readonly $compile;
  private readonly $scope: IScope;
  private readonly $element;
  template!: string;
  angularObjectCollection!: AngularObjectCollection;

  private _angularObjects: PushValue<AngularObject<unknown>[]>;

  constructor($compile, $scope, $element) {
    this.$compile = $compile;
    this.$scope = $scope;
    this.$element = $element;
  }

  $postLink() {
    this._angularObjects = new PushValueImpl();
    this.angularObjectCollection.angularObjects(this._angularObjects);
    this.watchAngularObjects();
    this.render();
  };

  private watchAngularObjects() {
    const variableAlias = this._angularObjects;
    const renderAlias = this.render;
    this.$scope.$watch(
      function() { return variableAlias.value(); },
      function(newValue, oldValue) {
        newValue.forEach(newAoValue => {
          const oldAoValue = oldValue.find(ao => ao.name() === newAoValue.name());
          if(oldAoValue.value() !== newAoValue.value()){
            renderAlias();
          }
        });
      }
    );
  }

  private render(){
    this.bindVariablesToScope();
    this.compile();
  }

  private compile(): void {
    const compiledElements = this.$compile(this.template)(this.$scope);
    const targetDiv = this.$element[0].querySelector('#anchor');
    angular.element(targetDiv).empty();
    angular.element(targetDiv).append(compiledElements);
  }

  private bindVariablesToScope(): void {
    for(const angularObject of this._angularObjects.value()){
      const key = angularObject.name();
      this.$scope[key] = angularObject.value();
      this.$scope.$watch(key, function(newValue, oldValue){
        if(newValue !== oldValue){
          angularObject.update(newValue);
        }
      });
    }
  }
}

export const angularPluginAjs = {
  template: `
      <div id="anchor"></div>
    `,
  bindings: {
    plugin: '=',
    angularObjects: '=',
  },
  controller: AngularPluginAjs
};

angular.module('zeppelinWebApp')
  .component('angularPluginAjs', angularPluginAjs);
