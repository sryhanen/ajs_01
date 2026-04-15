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
describe('ColumnselectorTransformation service', function() {
  beforeEach(angular.mock.module('zeppelinWebApp.columnselectorTransformation'));
  let service;

  const parsedData = {
    'columns': [
      {
        'name': 'Year',
        'index': 0,
        'aggr': 'sum',
      },
      {
        'name': 'MajorRegion',
        'index': 1,
        'aggr': 'sum',
      },
      {
        'name': 'Debt',
        'index': 2,
        'aggr': 'sum',
      },
      {
        'name': 'Interest',
        'index': 3,
        'aggr': 'sum',
      }
    ],
    'rows': [
      [
        '2017',
        'Capital district',
        '32361827439',
        '1'
      ],
      [
        '2018',
        'Capital district',
        '33673670582',
        '2'
      ],
      [
        '2019',
        'Capital district',
        '35664567321',
        '3'
      ],
      [
        '2020',
        'Capital district',
        '38339816588',
        '1'
      ],
      [
        '2021',
        'Capital district',
        '40634831854',
        '1'
      ],
      [
        '2017',
        'Other Helsinki-Uusimaa',
        '14309514948',
        '1'
      ],
      [
        '2018',
        'Other Helsinki-Uusimaa',
        '14308236595',
        '1'
      ],
      [
        '2019',
        'Other Helsinki-Uusimaa',
        '14497554181',
        '3'
      ],
      [
        '2020',
        'Other Helsinki-Uusimaa',
        '14912291410',
        '1'
      ],
      [
        '2021',
        'Other Helsinki-Uusimaa',
        '15189364403',
        '1'
      ],
      [
        '2017',
        'Southern Finland',
        '24347560556',
        '1'
      ],
      [
        '2018',
        'Southern Finland',
        '24118445230',
        '1'
      ],
      [
        '2019',
        'Southern Finland',
        '24237252979',
        '3'
      ],
      [
        '2020',
        'Southern Finland',
        '24617971549',
        '1'
      ],
      [
        '2021',
        'Southern Finland',
        '24597488869',
        '1'
      ],
      [
        '2017',
        'Western Finland',
        '29694160275',
        '1'
      ],
      [
        '2018',
        'Western Finland',
        '29669804450',
        '1'
      ],
      [
        '2019',
        'Western Finland',
        '30046575715',
        '3'
      ],
      [
        '2020',
        'Western Finland',
        '30771051048',
        '1'
      ],
      [
        '2021',
        'Western Finland',
        '30931924721',
        '1'
      ],
      [
        '2017',
        'Northern and Eastern Finland',
        '24822234550',
        '1'
      ],
      [
        '2018',
        'Northern and Eastern Finland',
        '24518231111',
        '1'
      ],
      [
        '2019',
        'Northern and Eastern Finland',
        '24518889505',
        '3'
      ],
      [
        '2020',
        'Northern and Eastern Finland',
        '24770339984',
        '1'
      ],
      [
        '2021',
        'Northern and Eastern Finland',
        '24574359105',
        '1'
      ],
      [
        '2017',
        'Åland',
        '1026593326',
        '1'
      ],
      [
        '2018',
        'Åland',
        '1042153311',
        '1'
      ],
      [
        '2019',
        'Åland',
        '1068396604',
        '3'
      ],
      [
        '2020',
        'Åland',
        '1083875022',
        '1'
      ],
      [
        '2021',
        'Åland',
        '1080111682',
        '1'
      ]
    ],
    'comment': ''
  };

  const testNormalConfig = {
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
        'groups': [],
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

  beforeEach(angular.mock.inject(function($injector) {
    service = $injector.get('columnselectorTransformationsService');
  }));

  const functions = [
    'getColumnselectorSetting',
    'columnselectorTransform',
  ];

  functions.forEach(function(fn) {
    it(`check for service functions to be defined : ${fn}`, function() {
      expect(service[fn]).toBeDefined();
    });
  });

  it('should set up default settings if none provided', function() {
    const setting = service.getColumnselectorSetting({});
    expect(setting).toBeDefined();
    expect(setting.length).toEqual(4);
    expect(setting[1].limit).toEqual(1);
    expect(setting[0].content.length).toEqual(0);
    expect(setting[2].content.length).toEqual(0);
    expect(setting[3].content.length).toEqual(0);
    expect(setting[1].content.length).toEqual(0);
    expect(setting[2].id).toEqual('group');
    expect(setting[3].aggr).toEqual(false);
  });

  it('should set up settings correctly', function() {
    const setting = service.getColumnselectorSetting(testNormalConfig);
    expect(setting.length).toEqual(4);
    expect(setting[0].content[0].name).toEqual('MajorRegion');
    expect(setting[1].content[0].UUID).toEqual(1710928500876);
    expect(setting[3].content.length).toEqual(1);
    expect(setting[3].content[0].aggr).toEqual(false);
  });

  it('transformed data should come out the same, configs should change', function() {
    const configCopy = angular.copy(testNormalConfig);
    const transformed = service.columnselectorTransform(parsedData, configCopy);
    expect(transformed).toEqual(parsedData);
    expect(angular.equals(configCopy, testNormalConfig)).toBeFalsy();
    expect(configCopy.rotate).toBeNull();
    expect(configCopy.common).toBeNull();
  });

});
