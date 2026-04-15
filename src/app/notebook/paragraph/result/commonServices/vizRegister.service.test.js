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
describe('Service: Viz register', function() {
  beforeEach(angular.mock.module('zeppelinWebApp.vizRegister'));

  let service;
  let spyCounter = 0;

  const spyCallback = function (data) {

    spyCounter++;
  };

  const spyReset = function () {
    spyCounter = 0;
  };

  const testRegister = {};
  testRegister.inclusion = '/some/test/path/for/test.html';
  testRegister.controllerName = 'TestCTRL';

  testRegister.hasSettings = false;
  testRegister.compatibleList = [];
  testRegister.id = 'testID';
  testRegister.name = 'Test';
  testRegister.getButton = function () {

    return {};
  };
  testRegister.isCompatible = function (type) {

    return true;
  };

  beforeEach(angular.mock.inject(function($injector) {
    service = $injector.get('vizRegisterService');
    //clear the storage
    service.storage = {template:{}, instance:{}};
    //add a test one without using functions
    service.storage.template['testIDdefault'] = testRegister;
    service.storage.instance['testParID'] = [{
      emitConfig: spyCallback,
      update: spyCallback,
      customCallback: spyCallback,
    }];
  }));

  const functions = [
    'register',
    'createLink',
    'linkEmitConfig',
    'linkUpdateViz',
    'updateViz',
    'emitConfig',
    'getViz',
    'getList',
    'defaultInstance',
  ];

  functions.forEach(function(fn) {
    it(`check for service functions to be defined : ${fn}`, function() {
      expect(service[fn]).toBeDefined();
    });
  });

  it('should register new item correctly', function() {
    expect(Object.keys(service.storage.template).length).toEqual(1);
    service.register('testID2', testRegister);

    expect(Object.keys(service.storage.template).length).toEqual(2);
  });

  it('should default instance correctly', function() {
    expect(Object.keys(service.storage.instance).length).toEqual(1);
    service.defaultInstance('testID2', 0);

    expect(service.storage.instance['testID2'].length).toEqual(1);
    expect(Object.keys(service.storage.instance).length).toEqual(2);
    service.defaultInstance('testID2', 1);
    expect(service.storage.instance['testID2'].length).toEqual(2);
  });

  it('should create new link correctly', function() {
    expect(Object.keys(service.storage.instance['testParID'][0]).length).toEqual(3);
    service.createLink('testParID', 0, 'testCallback', spyCallback);
    expect(Object.keys(service.storage.instance['testParID'][0]).length).toEqual(4);
    expect(service.storage.instance['testParID'][0]['testCallback']).toEqual(spyCallback);
  });

  it('should link config emit callback correctly', function() {
    expect(service.storage.instance['testID2']).toBeUndefined();
    service.linkEmitConfig('testID2', 0, spyCallback);
    expect(Object.keys(service.storage.instance['testID2'][0]).length).toEqual(1);
  });

  it('should link update callback correctly', function() {
    expect(service.storage.instance['testID2']).toBeUndefined();
    service.linkUpdateViz('testID2', 0, spyCallback);
    expect(Object.keys(service.storage.instance['testID2'][0]).length).toEqual(1);
  });

  it('should call the stored callback for update', function() {
    spyReset();
    expect(spyCounter).toEqual(0);
    service.updateViz('testParID', 0, 'testData', {test:'config'});
    expect(spyCounter).toEqual(1);
  });

  it('should call the stored callback for emit config', function() {
    spyReset();
    expect(spyCounter).toEqual(0);
    service.emitConfig('testParID', 0, {test:'config'});
    expect(spyCounter).toEqual(1);
  });

  it('should get the correct viz from register', function() {
    const viz = service.getViz('testIDdefault');
    expect(viz).toEqual(testRegister);
  });

  it('should get the first viz from list, since the requested viz not found', function() {
    const viz = service.getViz('wrongID');
    expect(viz).toEqual(testRegister);
  });

  it('should get the full list of all registered visualizations', function() {
    const list = service.getList();
    const expected = Object.keys(service.storage.template);
    expect(list).toEqual(expected);
  });

  it('should return list of compatible visualisations', function() {
    //which is all, since compatible returns true
    const list = service.getList('test');
    const expected = Object.keys(service.storage.template);
    expect(list).toEqual(expected);
  });

});
