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

describe('Module Controller: Linechart', function() {
  beforeEach(angular.mock.module('zeppelinWebApp.vizLinechart'));

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
    'forceY': true,
    'lineWithFocus': true,
    'isDateFormat': false,
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
    'keys': [
      {
        'name': 'Year',
        'index': 0,
        'aggr': false,
        'UUID': 1707121248785
      }
    ],
    'groups': [
      {
        'name': 'MajorRegion',
        'index': 1,
        'aggr': false,
        'UUID': 1712041498094
      }
    ],
    'values': [
      {
        'name': 'Debt',
        'index': 2,
        'aggr': 'sum',
        'UUID': 1712041502816
      }
    ]
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
    pivotTransform: function (config, data) {


      this.spyPivotCount++;
      const transformation = {
        'keys': [
          {
            'name': 'Year',
            'index': 0,
            'aggr': false,
            'UUID': 1707121248785
          }
        ],
        'groups': [
          {
            'name': 'MajorRegion',
            'index': 1,
            'aggr': false,
            'UUID': 1712041498094
          }
        ],
        'values': [
          {
            'name': 'Debt',
            'index': 2,
            'aggr': 'sum',
            'UUID': 1712041502816
          }
        ],
        'schema': {
          'Year': {
            'order': 0,
            'index': 0,
            'type': 'key',
            'children': {
              'Capital district': {
                'order': 0,
                'index': 1,
                'type': 'group',
                'children': {
                  'Debt(sum)': {
                    'type': 'value',
                    'order': 0,
                    'index': 2
                  }
                }
              },
              'Other Helsinki-Uusimaa': {
                'order': 0,
                'index': 1,
                'type': 'group',
                'children': {
                  'Debt(sum)': {
                    'type': 'value',
                    'order': 0,
                    'index': 2
                  }
                }
              },
              'Southern Finland': {
                'order': 0,
                'index': 1,
                'type': 'group',
                'children': {
                  'Debt(sum)': {
                    'type': 'value',
                    'order': 0,
                    'index': 2
                  }
                }
              },
              'Western Finland': {
                'order': 0,
                'index': 1,
                'type': 'group',
                'children': {
                  'Debt(sum)': {
                    'type': 'value',
                    'order': 0,
                    'index': 2
                  }
                }
              },
              'Northern and Eastern Finland': {
                'order': 0,
                'index': 1,
                'type': 'group',
                'children': {
                  'Debt(sum)': {
                    'type': 'value',
                    'order': 0,
                    'index': 2
                  }
                }
              },
              '?land': {
                'order': 0,
                'index': 1,
                'type': 'group',
                'children': {
                  'Debt(sum)': {
                    'type': 'value',
                    'order': 0,
                    'index': 2
                  }
                }
              }
            }
          }
        },
        'rows': {
          '2017': {
            'Capital district': {
              'Debt(sum)': {
                'value': '32361827439',
                'count': 1
              }
            },
            'Other Helsinki-Uusimaa': {
              'Debt(sum)': {
                'value': '14309514948',
                'count': 1
              }
            },
            'Southern Finland': {
              'Debt(sum)': {
                'value': '24347560556',
                'count': 1
              }
            },
            'Western Finland': {
              'Debt(sum)': {
                'value': '29694160275',
                'count': 1
              }
            },
            'Northern and Eastern Finland': {
              'Debt(sum)': {
                'value': '24822234550',
                'count': 1
              }
            },
            '?land': {
              'Debt(sum)': {
                'value': '1026593326',
                'count': 1
              }
            }
          },
          '2018': {
            'Capital district': {
              'Debt(sum)': {
                'value': '33673670582',
                'count': 1
              }
            },
            'Other Helsinki-Uusimaa': {
              'Debt(sum)': {
                'value': '14308236595',
                'count': 1
              }
            },
            'Southern Finland': {
              'Debt(sum)': {
                'value': '24118445230',
                'count': 1
              }
            },
            'Western Finland': {
              'Debt(sum)': {
                'value': '29669804450',
                'count': 1
              }
            },
            'Northern and Eastern Finland': {
              'Debt(sum)': {
                'value': '24518231111',
                'count': 1
              }
            },
            '?land': {
              'Debt(sum)': {
                'value': '1042153311',
                'count': 1
              }
            }
          },
          '2019': {
            'Capital district': {
              'Debt(sum)': {
                'value': '35664567321',
                'count': 1
              }
            },
            'Other Helsinki-Uusimaa': {
              'Debt(sum)': {
                'value': '14497554181',
                'count': 1
              }
            },
            'Southern Finland': {
              'Debt(sum)': {
                'value': '24237252979',
                'count': 1
              }
            },
            'Western Finland': {
              'Debt(sum)': {
                'value': '30046575715',
                'count': 1
              }
            },
            'Northern and Eastern Finland': {
              'Debt(sum)': {
                'value': '24518889505',
                'count': 1
              }
            },
            '?land': {
              'Debt(sum)': {
                'value': '1068396604',
                'count': 1
              }
            }
          },
          '2020': {
            'Capital district': {
              'Debt(sum)': {
                'value': '38339816588',
                'count': 1
              }
            },
            'Other Helsinki-Uusimaa': {
              'Debt(sum)': {
                'value': '14912291410',
                'count': 1
              }
            },
            'Southern Finland': {
              'Debt(sum)': {
                'value': '24617971549',
                'count': 1
              }
            },
            'Western Finland': {
              'Debt(sum)': {
                'value': '30771051048',
                'count': 1
              }
            },
            'Northern and Eastern Finland': {
              'Debt(sum)': {
                'value': '24770339984',
                'count': 1
              }
            },
            '?land': {
              'Debt(sum)': {
                'value': '1083875022',
                'count': 1
              }
            }
          },
          '2021': {
            'Capital district': {
              'Debt(sum)': {
                'value': '40634831854',
                'count': 1
              }
            },
            'Other Helsinki-Uusimaa': {
              'Debt(sum)': {
                'value': '15189364403',
                'count': 1
              }
            },
            'Southern Finland': {
              'Debt(sum)': {
                'value': '24597488869',
                'count': 1
              }
            },
            'Western Finland': {
              'Debt(sum)': {
                'value': '30931924721',
                'count': 1
              }
            },
            'Northern and Eastern Finland': {
              'Debt(sum)': {
                'value': '24574359105',
                'count': 1
              }
            },
            '?land': {
              'Debt(sum)': {
                'value': '1080111682',
                'count': 1
              }
            }
          }
        }
      };
      return transformation;
    },
    getPivotSetting: function (config) {


      this.spyTransformCount++;
      const settings = [
        {
          'id': 'keys',
          'content': [
            {
              'name': 'Year',
              'index': 0,
              'aggr': false,
              'UUID': 1707121248785
            }
          ],
          'aggr': false,
          'limit': 0,
          '$$hashKey': 'object:1515'
        },
        {
          'id': 'groups',
          'content': [
            {
              'name': 'MajorRegion',
              'index': 1,
              'aggr': false,
              'UUID': 1712041498094
            }
          ],
          'aggr': false,
          'limit': 0,
          '$$hashKey': 'object:1516'
        },
        {
          'id': 'values',
          'content': [
            {
              'name': 'Debt',
              'index': 2,
              'aggr': 'sum',
              'UUID': 1712041502816
            }
          ],
          'aggr': true,
          'limit': 0,
          '$$hashKey': 'object:1517'
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
            '$$hashKey': 'object:807'
          },
          {
            'name': 'MajorRegion',
            'index': 1,
            'aggr': 'sum',
            '$$hashKey': 'object:808'
          },
          {
            'name': 'Debt',
            'index': 2,
            'aggr': 'sum',
            '$$hashKey': 'object:809'
          },
          {
            'name': 'Interest',
            'index': 3,
            'aggr': 'sum',
            '$$hashKey': 'object:810'
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
      controller = $controller('LinechartCtrl', {
        $scope: scope,
        vizRegisterService: vizRegisterServiceMock,
        pivotTransformationsService: transformationsServiceMock,
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
    expect(scope.configAdditions.forceY).toBeTruthy();
    expect(scope.configAdditions.lineWithFocus).toBeTruthy();
    expect(scope.configAdditions.isDateFormat).toBeFalsy();
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
    scope.initViz(elementMock);


    expect(elementMock.html()).toEqual('<svg></svg>');
    expect(elementMock[0].id).toEqual('testID_0_viz');
    expect(resultParserServiceMock.spyParserCount).toEqual(1);
    expect(transformationsServiceMock.spyTransformCount).toEqual(1);
    expect(transformationsServiceMock.spyPivotCount).toEqual(1);
    storage.refresh(inputData, inputConfig);
    expect(resultParserServiceMock.spyParserCount).toEqual(2);
    expect(transformationsServiceMock.spyTransformCount).toEqual(2);
    expect(transformationsServiceMock.spyPivotCount).toEqual(2);
    //testing save
    const testCollection = [
      {
        'id': 'keys',
        'content': [
          {
            'name': 'Year',
            'index': 0,
            'aggr': false,
            'UUID': 1707121248785
          }
        ],
        'aggr': false,
        'limit': 0,
      },
      {
        'id': 'groups',
        'content': [
          {
            'name': 'MajorRegion',
            'index': 1,
            'aggr': false,
            'UUID': 1712041498094
          }
        ],
        'aggr': false,
        'limit': 0,
      },
      {
        'id': 'values',
        'content': [
          {
            'name': 'Debt',
            'index': 2,
            'aggr': 'sum',
            'UUID': 1712041502816
          }
        ],
        'aggr': true,
        'limit': 0,
      }
    ];
    scope.configAdditions = {
      addition1: true,
      addition2: 42,
    };
    scope.save(testCollection);
    expect(storage.collection.id).toEqual('testID');
    expect(storage.collection.index).toEqual(0);
    expect(storage.collection.config.common.pivot).toEqual(exampleCollection);
    expect(storage.collection.config.addition1).toBeTruthy();
    expect(storage.collection.config.addition2).toEqual(42);
  });

});
