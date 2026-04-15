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

describe('Module Controller: Network', function() {
  beforeEach(angular.mock.module('zeppelinWebApp.vizNetwork'));

  let scope;
  let controller;
  let elementMock;
  let compile;
  let storage = {};
  //example data
  const inputData = {
    'nodes': [
      {'id': 1},
      {'id': 2},
      {'id': 3}
    ],
    'edges': [
      {'source': 1, 'target': 2, 'id' : 1},
      {'source': 2, 'target': 3, 'id' : 2},
      {'source': 1, 'target': 2, 'id' : 3},
      {'source': 1, 'target': 2, 'id' : 4},
      {'source': 2, 'target': 1, 'id' : 5},
      {'source': 2, 'target': 1, 'id' : 6}
    ]
  };
  //example config
  const inputConfig = {
    'common': {},
    'properties': {},
    'd3Graph': {
      'forceLayout': {
        'timeout': 10000,
        'charge': -120,
        'linkDistance': 80
      },
      'zoom': {
        'minScale': 2
      }
    }
  };

  const vizRegisterServiceMock = {
    linkUpdateViz: function (id, index, refresh) {

      storage = {
        id: id,
        index: index,
        refresh: refresh,
      };

    },
    emitConfig: function (id, index, config) {
      this.callCounter++;
      storage.collection = {
        id: id,
        index: index,
        config: config,
      };
    },
    callCounter: 0,
  };

  const resultParserServiceMock = {
    loadNetworkResult: function (data) {

      const parsedData = {
        'columns': [
          {
            'name': 'id',
            'index': 0,
            'aggr': 'sum'
          }
        ],
        'rows': [
          [
            1
          ],
          [
            2
          ],
          [
            3
          ],
          [
            1
          ],
          [
            2
          ],
          [
            3
          ],
          [
            4
          ],
          [
            5
          ],
          [
            6
          ]
        ],
        'comment': 'test',
        'graph': {
          'nodes': [
            {
              'id': 1,
              'data': {},
              'index': 0,
              'weight': 5,
              'x': 566.93790436704,
              'y': 258.80694514615266,
              'px': 566.9533074130572,
              'py': 258.8179418616389
            },
            {
              'id': 2,
              'data': {},
              'index': 1,
              'weight': 6,
              'x': 634.1317326561019,
              'y': 216.60918799403012,
              'px': 634.1164159701384,
              'py': 216.6133813193002
            },
            {
              'id': 3,
              'data': {},
              'index': 2,
              'weight': 1,
              'x': 617.8174863155919,
              'y': 292.5492808698495,
              'px': 617.8216830593457,
              'py': 292.53500680149597
            }
          ],
          'edges': [
            {
              'source': {
                'id': 1,
                'data': {},
                'index': 0,
                'weight': 5,
                'x': 566.93790436704,
                'y': 258.80694514615266,
                'px': 566.9533074130572,
                'py': 258.8179418616389
              },
              'target': {
                'id': 2,
                'data': {},
                'index': 1,
                'weight': 6,
                'x': 634.1317326561019,
                'y': 216.60918799403012,
                'px': 634.1164159701384,
                'py': 216.6133813193002
              },
              'id': 1,
              'data': {},
              'count': 1,
              'totalCount': 3
            },
            {
              'source': {
                'id': 1,
                'data': {},
                'index': 0,
                'weight': 5,
                'x': 566.93790436704,
                'y': 258.80694514615266,
                'px': 566.9533074130572,
                'py': 258.8179418616389
              },
              'target': {
                'id': 2,
                'data': {},
                'index': 1,
                'weight': 6,
                'x': 634.1317326561019,
                'y': 216.60918799403012,
                'px': 634.1164159701384,
                'py': 216.6133813193002
              },
              'id': 3,
              'data': {},
              'count': 2,
              'totalCount': 3
            },
            {
              'source': {
                'id': 1,
                'data': {},
                'index': 0,
                'weight': 5,
                'x': 566.93790436704,
                'y': 258.80694514615266,
                'px': 566.9533074130572,
                'py': 258.8179418616389
              },
              'target': {
                'id': 2,
                'data': {},
                'index': 1,
                'weight': 6,
                'x': 634.1317326561019,
                'y': 216.60918799403012,
                'px': 634.1164159701384,
                'py': 216.6133813193002
              },
              'id': 4,
              'data': {},
              'count': 3,
              'totalCount': 3
            },
            {
              'source': {
                'id': 2,
                'data': {},
                'index': 1,
                'weight': 6,
                'x': 634.1317326561019,
                'y': 216.60918799403012,
                'px': 634.1164159701384,
                'py': 216.6133813193002
              },
              'target': {
                'id': 1,
                'data': {},
                'index': 0,
                'weight': 5,
                'x': 566.93790436704,
                'y': 258.80694514615266,
                'px': 566.9533074130572,
                'py': 258.8179418616389
              },
              'id': 5,
              'data': {},
              'count': 1,
              'totalCount': 2
            },
            {
              'source': {
                'id': 2,
                'data': {},
                'index': 1,
                'weight': 6,
                'x': 634.1317326561019,
                'y': 216.60918799403012,
                'px': 634.1164159701384,
                'py': 216.6133813193002
              },
              'target': {
                'id': 1,
                'data': {},
                'index': 0,
                'weight': 5,
                'x': 566.93790436704,
                'y': 258.80694514615266,
                'px': 566.9533074130572,
                'py': 258.8179418616389
              },
              'id': 6,
              'data': {},
              'count': 2,
              'totalCount': 2
            },
            {
              'source': {
                'id': 2,
                'data': {},
                'index': 1,
                'weight': 6,
                'x': 634.1317326561019,
                'y': 216.60918799403012,
                'px': 634.1164159701384,
                'py': 216.6133813193002
              },
              'target': {
                'id': 3,
                'data': {},
                'index': 2,
                'weight': 1,
                'x': 617.8174863155919,
                'y': 292.5492808698495,
                'px': 617.8216830593457,
                'py': 292.53500680149597
              },
              'id': 2,
              'data': {},
              'count': 1,
              'totalCount': 1
            }
          ]
        },
        'networkNodes': null,
        'networkRelationships': null,
        'isRendered': true,
        'isDefaultSet': true
      };
      this.spyParserCount++;
      return parsedData;
    },
    spyParserCount: 0,
  };

  beforeEach(angular.mock.inject(
    function(
      $controller,
      $rootScope,
      $compile,
    ) {
      scope = $rootScope.$new();
      compile = $compile;
      controller = $controller('NetworkCtrl', {
        $scope: scope,
        vizRegisterService: vizRegisterServiceMock,
        networkParserService: resultParserServiceMock,
      });

    }));

  const functions = [
    'initResult',
    'initViz',
    'saveConfig',
    'isEmptyObject',
    'setNetworkLabel',
  ];

  functions.forEach(function(fn) {
    it(`check for scope functions to be defined : ${fn}`, function() {
      expect(scope[fn]).toBeDefined();
    });
  });

  it('scope should be initialized', function() {
    expect(scope).toBeDefined();
    expect(controller).toBeDefined();
  });

  it('scope init result should set up correctly', function() {
    scope.initResult(
      'testID',
      0,
      inputData,
      inputConfig,
    );
    expect(scope.containerID).toEqual('testID_0');
    expect(scope.loaded).toBeTruthy();
    expect(storage.id).toEqual('testID');
    expect(storage.index).toEqual(0);
    expect(scope.tableDataComment).toEqual('test');
  });

  it('should recognize the empty object', function() {
    expect(scope.isEmptyObject({})).toBeTruthy();
    expect(scope.isEmptyObject(undefined)).toBeTruthy();
    expect(scope.isEmptyObject({data:'test'})).toBeFalsy();
  });

  it('viz should init and refresh correctly, save configs', function() {
    resultParserServiceMock.spyParserCount = 0;
    scope.initResult(
      'testID',
      0,
      inputData,
      inputConfig,
    );
    const template = '<div id=\'testID_0_DT\'></div>';
    elementMock = compile(template)(scope);
    //testing initViz
    scope.initViz(elementMock);
    expect(resultParserServiceMock.spyParserCount).toEqual(1);
    //testing update
    storage.refresh(inputData, inputConfig);
    expect(resultParserServiceMock.spyParserCount).toEqual(2);
    //save config
    scope.saveConfig();
    expect(vizRegisterServiceMock.callCounter).toEqual(1);
    expect(storage.collection.id).toEqual('testID');
    expect(storage.collection.index).toEqual(0);
  });

});
