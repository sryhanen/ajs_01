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
import 'nvd3/build/nv.d3';

describe('Module Controller: Scatterchart', function() {
  beforeEach(angular.mock.module('zeppelinWebApp.vizScatterchart'));

  let scope;
  let emptyScope;
  let controller;
  let elementMock;
  let compile;
  let storage = {};
  //example data
  const inputData = 'Year\tMajorRegion\tDebt\tInterest\n2017\tCapital district\t32361827439\t356942344\n2018\tCapital district\t33673670582\t363897717\n2019\tCapital district\t35664567321\t359372212\n2020\tCapital district\t38339816588\t354182353\n2021\tCapital district\t40634831854\t340774017\n2017\tOther Helsinki-Uusimaa\t14309514948\t186658249\n2018\tOther Helsinki-Uusimaa\t14308236595\t186920301\n2019\tOther Helsinki-Uusimaa\t14497554181\t185074538\n2020\tOther Helsinki-Uusimaa\t14912291410\t183900462\n2021\tOther Helsinki-Uusimaa\t15189364403\t176285153\n2017\tSouthern Finland\t24347560556\t351517478\n2018\tSouthern Finland\t24118445230\t348997937\n2019\tSouthern Finland\t24237252979\t340141033\n2020\tSouthern Finland\t24617971549\t336329960\n2021\tSouthern Finland\t24597488869\t321467164\n2017\tWestern Finland\t29694160275\t432811536\n2018\tWestern Finland\t29669804450\t429189639\n2019\tWestern Finland\t30046575715\t417401860\n2020\tWestern Finland\t30771051048\t411036590\n2021\tWestern Finland\t30931924721\t391160443\n2017\tNorthern and Eastern Finland\t24822234550\t371227446\n2018\tNorthern and Eastern Finland\t24518231111\t368102148\n2019\tNorthern and Eastern Finland\t24518889505\t357248067\n2020\tNorthern and Eastern Finland\t24770339984\t351755686\n2021\tNorthern and Eastern Finland\t24574359105\t332940978\n2017\tÅland\t1026593326\t12971445\n2018\tÅland\t1042153311\t13414334\n2019\tÅland\t1068396604\t13112285\n2020\tÅland\t1083875022\t12881023\n2021\tÅland\t1080111682\t11971512\n';
  //example config
  const inputConfig = {
    'xAxis': {
      'name': 'MajorRegion',
      'index': 1,
      'aggr': false,
      'UUID': 1698226413104
    },
    'yAxis': {
      'name': 'Year',
      'index': 0,
      'aggr': false,
      'UUID': 1710928500876
    },
    'group': {
      'name': 'Debt',
      'index': 2,
      'aggr': false,
      'UUID': 1698226925620
    },
    'size': {
      'name': 'Interest',
      'index': 3,
      'aggr': false,
      'UUID': 1710928507595
    },
    'rotate': {
      'degree': '-45'
    },
    'common': {
      'pivot': {
        'keys': [
          {
            'name': 'Year',
            'index': 0,
            'aggr': false,
            'UUID': 1710929363327
          }
        ],
        'groups': [
          {
            'name': 'MajorRegion',
            'index': 1,
            'aggr': false,
            'UUID': 1710928107227
          }
        ],
        'values': [
          {
            'name': 'Interest',
            'index': 3,
            'aggr': 'sum',
            'UUID': 1710928114526
          }
        ]
      }
    }
  };

  const exampleCollection = {
    'xAxis': {
      'name': 'MajorRegion',
      'index': 1,
      'aggr': false,
      'UUID': 1698226413104
    },
    'yAxis': {
      'name': 'Year',
      'index': 0,
      'aggr': false,
      'UUID': 1712048539275
    },
    'group': {
      'name': 'Debt',
      'index': 2,
      'aggr': false,
      'UUID': 1698226925620
    },
    'size': {
      'name': 'Interest',
      'index': 3,
      'aggr': false,
      'UUID': 1712048543817
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
      storage.collection = {
        id: id,
        index: index,
        config: config,
      };
    }
  };

  const transformationsServiceMock = {
    columnselectorTransform: function (config, data) {


      this.spyPivotCount++;
      const transformation = {
        'columns': [
          {
            'name': 'Year',
            'index': 0,
            'aggr': 'sum',
            '$$hashKey': 'object:795'
          },
          {
            'name': 'MajorRegion',
            'index': 1,
            'aggr': 'sum',
            '$$hashKey': 'object:796'
          },
          {
            'name': 'Debt',
            'index': 2,
            'aggr': 'sum',
            '$$hashKey': 'object:797'
          },
          {
            'name': 'Interest',
            'index': 3,
            'aggr': 'sum',
            '$$hashKey': 'object:798'
          }
        ],
        'rows': [
          [
            '2017',
            'Capital district',
            '32361827439',
            '356942344'
          ],
          [
            '2018',
            'Capital district',
            '33673670582',
            '363897717'
          ],
          [
            '2019',
            'Capital district',
            '35664567321',
            '359372212'
          ],
          [
            '2020',
            'Capital district',
            '38339816588',
            '354182353'
          ],
          [
            '2021',
            'Capital district',
            '40634831854',
            '340774017'
          ],
          [
            '2017',
            'Other Helsinki-Uusimaa',
            '14309514948',
            '186658249'
          ],
          [
            '2018',
            'Other Helsinki-Uusimaa',
            '14308236595',
            '186920301'
          ],
          [
            '2019',
            'Other Helsinki-Uusimaa',
            '14497554181',
            '185074538'
          ],
          [
            '2020',
            'Other Helsinki-Uusimaa',
            '14912291410',
            '183900462'
          ],
          [
            '2021',
            'Other Helsinki-Uusimaa',
            '15189364403',
            '176285153'
          ],
          [
            '2017',
            'Southern Finland',
            '24347560556',
            '351517478'
          ],
          [
            '2018',
            'Southern Finland',
            '24118445230',
            '348997937'
          ],
          [
            '2019',
            'Southern Finland',
            '24237252979',
            '340141033'
          ],
          [
            '2020',
            'Southern Finland',
            '24617971549',
            '336329960'
          ],
          [
            '2021',
            'Southern Finland',
            '24597488869',
            '321467164'
          ],
          [
            '2017',
            'Western Finland',
            '29694160275',
            '432811536'
          ],
          [
            '2018',
            'Western Finland',
            '29669804450',
            '429189639'
          ],
          [
            '2019',
            'Western Finland',
            '30046575715',
            '417401860'
          ],
          [
            '2020',
            'Western Finland',
            '30771051048',
            '411036590'
          ],
          [
            '2021',
            'Western Finland',
            '30931924721',
            '391160443'
          ],
          [
            '2017',
            'Northern and Eastern Finland',
            '24822234550',
            '371227446'
          ],
          [
            '2018',
            'Northern and Eastern Finland',
            '24518231111',
            '368102148'
          ],
          [
            '2019',
            'Northern and Eastern Finland',
            '24518889505',
            '357248067'
          ],
          [
            '2020',
            'Northern and Eastern Finland',
            '24770339984',
            '351755686'
          ],
          [
            '2021',
            'Northern and Eastern Finland',
            '24574359105',
            '332940978'
          ],
          [
            '2017',
            'Åland',
            '1026593326',
            '12971445'
          ],
          [
            '2018',
            'Åland',
            '1042153311',
            '13414334'
          ],
          [
            '2019',
            'Åland',
            '1068396604',
            '13112285'
          ],
          [
            '2020',
            'Åland',
            '1083875022',
            '12881023'
          ],
          [
            '2021',
            'Åland',
            '1080111682',
            '11971512'
          ]
        ],
        'comment': ''
      };
      return transformation;
    },
    getColumnselectorSetting: function (config) {


      this.spyTransformCount++;
      const settings = [
        {
          'id': 'xAxis',
          'content': [
            {
              'name': 'MajorRegion',
              'index': 1,
              'aggr': false,
              'UUID': 1698226413104
            }
          ],
          'aggr': false,
          'limit': 1,
          '$$hashKey': 'object:801'
        },
        {
          'id': 'yAxis',
          'content': [
            {
              'name': 'Year',
              'index': 0,
              'aggr': false,
              'UUID': 1712048539275
            }
          ],
          'aggr': false,
          'limit': 1,
          '$$hashKey': 'object:802'
        },
        {
          'id': 'group',
          'content': [
            {
              'name': 'Debt',
              'index': 2,
              'aggr': false,
              'UUID': 1698226925620
            }
          ],
          'aggr': false,
          'limit': 1,
          '$$hashKey': 'object:803'
        },
        {
          'id': 'size',
          'content': [
            {
              'name': 'Interest',
              'index': 3,
              'aggr': false,
              'UUID': 1712048543817
            }
          ],
          'aggr': false,
          'limit': 1,
          '$$hashKey': 'object:804'
        }
      ];
      return settings;
    },
    spyTransformCount: 0,
    spyPivotCount: 0,
  };

  const resultParserServiceMock = {
    loadTableResult: function (data) {

      const parsedData = {
        'columns': [
          {
            'name': 'Year',
            'index': 0,
            'aggr': 'sum',
            '$$hashKey': 'object:795'
          },
          {
            'name': 'MajorRegion',
            'index': 1,
            'aggr': 'sum',
            '$$hashKey': 'object:796'
          },
          {
            'name': 'Debt',
            'index': 2,
            'aggr': 'sum',
            '$$hashKey': 'object:797'
          },
          {
            'name': 'Interest',
            'index': 3,
            'aggr': 'sum',
            '$$hashKey': 'object:798'
          }
        ],
        'rows': [
          [
            '2017',
            'Capital district',
            '32361827439',
            '356942344'
          ],
          [
            '2018',
            'Capital district',
            '33673670582',
            '363897717'
          ],
          [
            '2019',
            'Capital district',
            '35664567321',
            '359372212'
          ],
          [
            '2020',
            'Capital district',
            '38339816588',
            '354182353'
          ],
          [
            '2021',
            'Capital district',
            '40634831854',
            '340774017'
          ],
          [
            '2017',
            'Other Helsinki-Uusimaa',
            '14309514948',
            '186658249'
          ],
          [
            '2018',
            'Other Helsinki-Uusimaa',
            '14308236595',
            '186920301'
          ],
          [
            '2019',
            'Other Helsinki-Uusimaa',
            '14497554181',
            '185074538'
          ],
          [
            '2020',
            'Other Helsinki-Uusimaa',
            '14912291410',
            '183900462'
          ],
          [
            '2021',
            'Other Helsinki-Uusimaa',
            '15189364403',
            '176285153'
          ],
          [
            '2017',
            'Southern Finland',
            '24347560556',
            '351517478'
          ],
          [
            '2018',
            'Southern Finland',
            '24118445230',
            '348997937'
          ],
          [
            '2019',
            'Southern Finland',
            '24237252979',
            '340141033'
          ],
          [
            '2020',
            'Southern Finland',
            '24617971549',
            '336329960'
          ],
          [
            '2021',
            'Southern Finland',
            '24597488869',
            '321467164'
          ],
          [
            '2017',
            'Western Finland',
            '29694160275',
            '432811536'
          ],
          [
            '2018',
            'Western Finland',
            '29669804450',
            '429189639'
          ],
          [
            '2019',
            'Western Finland',
            '30046575715',
            '417401860'
          ],
          [
            '2020',
            'Western Finland',
            '30771051048',
            '411036590'
          ],
          [
            '2021',
            'Western Finland',
            '30931924721',
            '391160443'
          ],
          [
            '2017',
            'Northern and Eastern Finland',
            '24822234550',
            '371227446'
          ],
          [
            '2018',
            'Northern and Eastern Finland',
            '24518231111',
            '368102148'
          ],
          [
            '2019',
            'Northern and Eastern Finland',
            '24518889505',
            '357248067'
          ],
          [
            '2020',
            'Northern and Eastern Finland',
            '24770339984',
            '351755686'
          ],
          [
            '2021',
            'Northern and Eastern Finland',
            '24574359105',
            '332940978'
          ],
          [
            '2017',
            'Åland',
            '1026593326',
            '12971445'
          ],
          [
            '2018',
            'Åland',
            '1042153311',
            '13414334'
          ],
          [
            '2019',
            'Åland',
            '1068396604',
            '13112285'
          ],
          [
            '2020',
            'Åland',
            '1083875022',
            '12881023'
          ],
          [
            '2021',
            'Åland',
            '1080111682',
            '11971512'
          ]
        ],
        'comment': ''
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
      emptyScope = $rootScope.$new();
      compile = $compile;
      controller = $controller('ScatterchartCtrl', {
        $scope: scope,
        vizRegisterService: vizRegisterServiceMock,
        columnselectorTransformationsService: transformationsServiceMock,
        tableParserService: resultParserServiceMock,
      });

    }));

  const functions = [
    'initResult',
    'initViz',
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
  });

  it('viz should init and refresh correctly', function() {
    transformationsServiceMock.spyPivotCount = 0;
    transformationsServiceMock.spyTransformCount = 0;
    resultParserServiceMock.spyParserCount = 0;
    scope.initResult(
      'testID',
      0,
      inputData,
      inputConfig,
    );
    const template = '<div id=\'testID_0_viz\'></div>';
    elementMock = compile(template)(emptyScope);
    //testing initViz
    scope.initViz(elementMock);


    expect(elementMock.html()).toEqual('<svg></svg>');
    expect(elementMock[0].id).toEqual('testID_0_viz');
    expect(resultParserServiceMock.spyParserCount).toEqual(1);
    expect(transformationsServiceMock.spyTransformCount).toEqual(1);
    expect(transformationsServiceMock.spyPivotCount).toEqual(1);
    //testing refresh
    storage.refresh(inputData, inputConfig);
    expect(resultParserServiceMock.spyParserCount).toEqual(2);
    expect(transformationsServiceMock.spyTransformCount).toEqual(2);
    expect(transformationsServiceMock.spyPivotCount).toEqual(2);
    //testing save
    const testCollection = [
      {
        'id': 'xAxis',
        'content': [
          {
            'name': 'MajorRegion',
            'index': 1,
            'aggr': false,
            'UUID': 1698226413104
          }
        ],
        'aggr': false,
        'limit': 1,
      },
      {
        'id': 'yAxis',
        'content': [
          {
            'name': 'Year',
            'index': 0,
            'aggr': false,
            'UUID': 1712048539275
          }
        ],
        'aggr': false,
        'limit': 1,
      },
      {
        'id': 'group',
        'content': [
          {
            'name': 'Debt',
            'index': 2,
            'aggr': false,
            'UUID': 1698226925620
          }
        ],
        'aggr': false,
        'limit': 1,
      },
      {
        'id': 'size',
        'content': [
          {
            'name': 'Interest',
            'index': 3,
            'aggr': false,
            'UUID': 1712048543817
          }
        ],
        'aggr': false,
        'limit': 1,
      }
    ];
    scope.save(testCollection);
    expect(storage.collection.id).toEqual('testID');
    expect(storage.collection.index).toEqual(0);
    expect(storage.collection.config).toEqual(exampleCollection);
  });

});
