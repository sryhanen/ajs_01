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
import {AngularPluginAjs} from './angularPlugin.ajs';
import {AngularObjectCollection} from '../../objects/angularObjectCollection/angularObjectCollection';
import {AngularObjectCollectionImpl} from '../../objects/angularObjectCollection/angularObjectCollectionImpl';
import {FakeChannel} from '../../objects/channel/fakeChannel';
import {AngularPluginImpl} from '../../objects/output/plugins/angularPlugin/angularPluginImpl';
import {AngularObjectImpl} from '../../objects/angularObject/angularObjectImpl';

describe('AngularPluginAjs', () => {
  const $element = [
    {
      querySelector: () => {}
    }
  ];
  const mockLinkFunction = vi.fn().mockReturnValue($element);
  let $compile;
  let $scope;
  const channel = new FakeChannel();
  const template = '<h1>Test Template</h1>';
  let angularObjectCollection: AngularObjectCollection;

  let angularPluginAjs: AngularPluginAjs;
  beforeEach(() => {
    $compile  = vi.fn().mockReturnValue(mockLinkFunction);
    $scope = {
      $watch: vi.fn(),
      $watchCollection: vi.fn(),
    };
    angularObjectCollection = new AngularObjectCollectionImpl(channel);
    angularPluginAjs = new AngularPluginAjs($compile,$scope,$element);
    angularPluginAjs.outputPlugin = new AngularPluginImpl(channel, template, angularObjectCollection);
    angularPluginAjs.angularObjects = [new AngularObjectImpl(channel, {name: 'name', object: 'value'}, '')];
  });

  describe('Birth', () => {
    it('Should be initialized', () => {
      expect(angularPluginAjs).toBeDefined();
    });

    it('Should have $scope.z.runParagraph', () => {
      expect(angularPluginAjs.$scope['z']['runParagraph']).toBeDefined();
    });

    it('Should have $scope.z.angularBind', () => {
      expect(angularPluginAjs.$scope['z']['angularBind']).toBeDefined();
    });

    it('Should have $scope.z.angularUnbind', () => {
      expect(angularPluginAjs.$scope['z']['angularUnbind']).toBeDefined();
    });
  });

  describe('$postLink', () => {
    let scopeSpy;

    beforeEach(() => {
      scopeSpy = vi.spyOn(angularPluginAjs.$scope, '$watchCollection');
      angularPluginAjs.$postLink();
    });

    it('Should evoked $watchCollection', () => {
      expect(scopeSpy).toHaveBeenCalledTimes(1);
    });

    it('Should bound angularObject to scope', () => {
      expect(angularPluginAjs.$scope['name']).toBeDefined();
    });

    it('Should have compiled', () => {
      expect($compile).toHaveBeenCalledTimes(1);
    });
  });
});
