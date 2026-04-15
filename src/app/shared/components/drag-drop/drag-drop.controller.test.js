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
const inputDataExample = [
  {
    name:'YEAR',
    aggr: 'none',
  },
  {
    name:'DEBT',
    aggr: 'none',
  },
  {
    name:'REGION',
    aggr: 'none',
  },
  {
    name:'SOMETHING',
    aggr: 'none',
  },
];

const zoneCollectionExample = [
  {
    id: 'keys',
    aggr: false,
    content: [],
    limit: 0
  },
  {
    id: 'groups',
    aggr: false,
    content: [
      {
        name:'SOMETHING',
        aggr: 'none',
      }
    ],
    limit: 1,
  },
  {
    id: 'values',
    aggr: true,
    content: [],
    limit: 0,
  },
];

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

const saveMock = function (input) {

};

const ToasterServiceMock = {
  addToast: function (message) {

  }
};

describe('Controller: dragDropController', () => {
  beforeEach(angular.mock.module('zeppelinWebApp.comDragdrop'));
  let ctrl, scope, rootscope;

  beforeEach(angular.mock.inject(function($injector, $rootScope, $controller) {
    scope = $rootScope.$new();
    rootscope = $rootScope;

    ctrl = $controller('dragDropController', {
      $scope: scope,
      $rootScope: rootscope,
      ToasterService: ToasterServiceMock,
    });
    scope.init(zoneCollectionExample, inputDataExample,  saveMock);
    scope.$digest();
  }));

  const scopeFunctions = [
    'init',
    'setSelection',
    'addSelection',
    'dragitem',
    'removeItem',
    'changeAggr',
    'reset',
  ];

  const privateFunctions = [
    'chooseDefaultAggr',
    'addItem',
    'trySwap',
    'removeItem',
    'checkDup',
  ];

  scopeFunctions.forEach(function(fn) {
    it(`check for scope functions to be defined : ${fn}`, function() {
      expect(scope[fn]).toBeDefined();
    });
  });

  privateFunctions.forEach(function(fn) {
    it(`check for scope functions to be defined : ${fn}`, function() {
      expect(ctrl[fn]).toBeDefined();
    });
  });

  it('should init correctly', () => {
    const list = {
      SUM: 'sum',
      COUNT: 'count',
      AVG: 'avg',
      MIN: 'min',
      MAX: 'max',
    };
    const expected = Object.values(list);
    expect(scope.inputData).toEqual(inputDataExample);
    expect(scope.zoneCollection).toEqual(zoneCollectionExample);
    expect(scope.aggregationExport).toEqual(expected);
    expect(scope.selectionToAdd).toEqual(selectionDefault);
  });

  it('should choose an aggregation correctly', () => {
    const item = {
        name:'Test',
        data:'test2',
        aggr: 'none',
      };
    let collection = [];
    let suggest = ctrl.chooseDefaultAggr(item, collection);
    expect(suggest).toEqual('sum');
    collection = [
      {
        name:'Test',
        aggr: 'sum',
      },
      {
        name:'Test',
        aggr: 'avg',
      },
    ];
    suggest = ctrl.chooseDefaultAggr(item, collection);
    expect(suggest).toEqual('count');
    collection.push(
      {
        name:'Test',
        aggr: 'count',
      },
    );
    suggest = ctrl.chooseDefaultAggr(item, collection);
    expect(suggest).toEqual('min');
  });

  it('should check for duplicates correctly', () => {
    const item = {
      name:'Test',
      aggr: 'SUM',
    };
    const item2 = {
      name:'Test',
      aggr: 'New',
    };
    const item3 = {
      name:'Test2',
      aggr: 'SUM',
    };
    const collection = {
      aggr: true,
      content: [
        {
          name:'Test',
          aggr: 'SUM',
        },
        {
          name:'Test',
          aggr: 'AVG',
        },
      ]
    };
    expect(ctrl.checkDup(item, collection)).toBeFalsy();
    expect(ctrl.checkDup(item2, collection)).toBeTruthy();
    expect(ctrl.checkDup(item3, collection)).toBeTruthy();
  });

  it('should change the selection model to SUM', () => {
    scope.setSelection('aggr', 'sum');
    scope.$digest();
    expect(scope.selectionToAdd.aggr).toEqual('sum');
  });

  it('should reset collections', () => {
    scope.init(zoneCollectionExample, inputDataExample,  saveMock);
    const content0 = [
      {
        name:'Test',
        aggr: 'SUM',
      },
      {
        name:'Test',
        aggr: 'AVG',
      },
    ];
    const content1 = [
      {
        name:'TestAnother',
        aggr: 'SUM',
      },
    ];
    scope.zoneCollection[0].content = content0;
    scope.zoneCollection[1].content = content1;
    scope.$digest();
    expect(scope.zoneCollection[0].content.length).toEqual(2);
    expect(scope.zoneCollection[1].content.length).toEqual(1);
    scope.reset();
    scope.$digest();
    expect(scope.zoneCollection[0].content.length).toEqual(0);
    expect(scope.zoneCollection[1].content.length).toEqual(0);
  });

  it('should add items correctly', () => {
    const selection = {
      item: {
        name: 'YEAR',
        aggr: 'none',
      },
      field: {
        id: 'values',
        aggr: true,
        content: [],
        limit: 0,
      },
    };
    scope.zoneCollection[2].content = [];
    scope.zoneCollection[2].limit = 0;
    scope.setSelection('item', selection.item);
    scope.setSelection('field', selection.field);
    scope.$digest();
    scope.addSelection();
    scope.$digest();
    expect(scope.zoneCollection[2].content.length).toEqual(1);
    scope.addSelection();
    scope.$digest();
    scope.addSelection();
    scope.$digest();
    scope.addSelection();
    scope.$digest();
    scope.addSelection();
    scope.$digest();
    expect(scope.zoneCollection[2].content.length).toEqual(5);
    scope.addSelection();
    scope.$digest();
    expect(scope.zoneCollection[2].content.length).toEqual(5);
    scope.setSelection('aggr', 'SUM');
    scope.addSelection();
    scope.$digest();
    expect(scope.zoneCollection[2].content.length).toEqual(5);
  });

  it('should remove item from correct collection by index', () => {
    const collection = [
      {
        name:'Test',
        aggr: 'SUM',
        UUID: 42,
      },
      {
        name:'Test',
        aggr: 'AVG',
        UUID: 43,
      },
    ];
    const lastItem = {
      name:'Test',
      aggr: 'AVG',
      UUID: 43,
    };
    scope.zoneCollection[2].content = collection;
    scope.$digest();
    expect(scope.zoneCollection[2].content.length).toEqual(2);
    scope.removeItem(42);
    expect(scope.zoneCollection[2].content.length).toEqual(1);
    expect(scope.zoneCollection[2].content[0]).toEqual(lastItem);
  });

  it('should change aggregation of the chosen item', () => {
    const collection = [
      {
        name:'Test',
        aggr: 'SUM',
      },
      {
        name:'Test',
        aggr: 'AVG',
      },
    ];
    const zone =  {
      id: 'values',
        aggr: true,
        content: [],
        limit: 0,
    };
    scope.zoneCollection[2].content = collection;
    scope.$digest();
    scope.changeAggr(zone, 'COUNT', collection[1]);
    expect(scope.zoneCollection[2].content[1].aggr).toEqual('COUNT');
  });

  it('should drag the item from one collection to another', () => {
    spyOn(ctrl, 'removeItem');
    const collection1 = [
      {
        name:'Test',
        aggr: 'sum',
        UUID: 42,
      },
    ];
    const collection2 = [
      {
        name:'Test2',
        aggr: 'avg',
        UUID: 43,
      },
    ];
    scope.zoneCollection[1].content = JSON.parse(JSON.stringify(collection1));
    scope.zoneCollection[1].aggr = true;
    scope.zoneCollection[1].limit = 0;
    scope.zoneCollection[2].content = JSON.parse(JSON.stringify(collection2));
    scope.zoneCollection[2].aggr = true;
    scope.zoneCollection[2].limit = 0;
    scope.$digest();
    scope.dragitem(scope.zoneCollection[1], scope.zoneCollection[2].content[0]);
    scope.$digest();
    expect(ctrl.removeItem).toHaveBeenCalledWith(43);
    expect(scope.zoneCollection[1].content.length).toEqual(2);
  });

  it('should not drag the item from one collection to another if limit is exceeded', () => {
    const collection1 = [
      {
        name:'Test',
        aggr: 'sum',
        UUID: 42,
      },
    ];
    const collection2 = [
      {
        name:'Test2',
        aggr: 'avg',
        UUID: 43,
      },
      {
        name:'Test3',
        aggr: 'count',
        UUID: 44,
      },
    ];
    scope.zoneCollection[1].content = JSON.parse(JSON.stringify(collection1));
    scope.zoneCollection[1].limit = 1;
    scope.zoneCollection[1].aggr = true;
    scope.zoneCollection[2].content = JSON.parse(JSON.stringify(collection2));
    scope.zoneCollection[2].limit = 2;
    scope.zoneCollection[2].aggr = true;
    scope.$digest();
    scope.dragitem(scope.zoneCollection[2], scope.zoneCollection[1].content[0]);
    scope.$digest();
    expect(scope.zoneCollection[2].content.length).toEqual(2);
    expect(scope.zoneCollection[1].content.length).toEqual(1);
  });

  it('should swap the items if limits are 1, otherwise not', () => {
    const collection1 = [
      {
        name:'Test',
        aggr: 'sum',
        UUID: 42,
      },
    ];
    const collection2 = [
      {
        name:'Test2',
        aggr: 'avg',
        UUID: 43,
      },
    ];
    const collection0 = [
      {
        name:'Test3',
        aggr: 'avg',
        UUID: 40,
      },
      {
        name:'Test4',
        aggr: 'count',
        UUID: 41,
      },
    ];
    scope.zoneCollection[1].content = JSON.parse(JSON.stringify(collection1));
    scope.zoneCollection[1].limit = 1;
    scope.zoneCollection[2].content = JSON.parse(JSON.stringify(collection2));
    scope.zoneCollection[2].limit = 1;
    scope.$digest();
    ctrl.trySwap(collection1[0].UUID, collection2[0].UUID);
    scope.$digest();
    expect(scope.zoneCollection[2].content[0].UUID).toEqual(42);
    expect(scope.zoneCollection[1].content[0].UUID).toEqual(43);
    scope.zoneCollection[0].content = JSON.parse(JSON.stringify(collection0));
    scope.zoneCollection[0].limit = 2;
    scope.$digest();
    ctrl.trySwap(43, 40);
    expect(scope.zoneCollection[0].content[0].UUID).toEqual(40);
    expect(scope.zoneCollection[1].content[0].UUID).toEqual(43);
  });

});
