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
import {ParagraphStatus} from '../paragraph.status';

angular.module('zeppelinWebApp.newResult').controller('testCtrl', ['$scope', testCtrl]);
function testCtrl($scope) {
  $scope.initResult = function () {

  };
}

describe('Controller: ResultCtrl', function() {
  beforeEach(angular.mock.module('zeppelinWebApp.newResult'));

  let scope;
  let controller;
  let compile;
  const resultMock = {
    type: 'TABLE',
    data: 'test',
  };
  const configMock = {
    graph: {
      'mode': 'table',
      'height': 300,
      'optionOpen': false,
      'setting': {
        'table': {
          'tableGridState': {},
          'tableColumnTypeState': {},
          'tableOptionSpecHash': '[{"name":"useFilter","valueType":"boolean","defaultValue":false,"widget":"checkbox","description":"Enable filter for columns"},{"name":"showPagination","valueType":"boolean","defaultValue":false,"widget":"checkbox","description":"Enable pagination for better navigation"},{"name":"showAggregationFooter","valueType":"boolean","defaultValue":false,"widget":"checkbox","description":"Enable a footer for displaying aggregated values"}]',
          'tableOptionValue': {
            'useFilter': false,
            'showPagination': false,
            'showAggregationFooter': false
          },
          'updated': false,
          'initialized': false
        }
      },
      'commonSetting': { test: 'some test setting'},
    },
  };

  const exampleGetviz = {
    'tableGridState': {},
    'tableColumnTypeState': {},
    'tableOptionSpecHash': '[{"name":"useFilter","valueType":"boolean","defaultValue":false,"widget":"checkbox","description":"Enable filter for columns"},{"name":"showPagination","valueType":"boolean","defaultValue":false,"widget":"checkbox","description":"Enable pagination for better navigation"},{"name":"showAggregationFooter","valueType":"boolean","defaultValue":false,"widget":"checkbox","description":"Enable a footer for displaying aggregated values"}]',
    'tableOptionValue': {
      'useFilter': false,
      'showPagination': false,
      'showAggregationFooter': false
    },
    'updated': false,
    'initialized': false,
    common: { test: 'some test setting'},
  };


  const paragraphMock = {
    id: 'p1',
    title: 'testTitle',
    dateFinished: '2024-01-05T13:49:57+0000',
    results: {
      msg: [resultMock],
      code: 'SUCCESS',
    },
    config:{
      results:[
        configMock,
      ]
    },
    settings: {
      params: 'some test params'
    },
  };

  const vizMock = {
    id: 'table',
    hasSettings: true,
    inclusion: 'some_test_path',
    controllerName: 'testCtrl',
    getButton: function (input) {

      return 'test data';
    }
  };

  const vizMock2 = {
    id: 'not_table',
    hasSettings: true,
    inclusion: 'some_test_path_2',
    controllerName: 'testCtrl',
    getButton: function (input) {

      return 'test data 2';
    }
  };

  const storage = {
    emitter: {
      id: '',
      index: -1,
    },
    commit: 0,
    update: 0,
    saveAs: {
      data: '',
      ext: '',
      name: '',
    },
  };

  const vizRegisterServiceMock = {
    getViz: function (input) {

      if(input === 'testViz'){
        return vizMock2;
      }else {return vizMock;}
    },
    getList: function (input) {

      return ['table', 'network'];
    },
    linkEmitConfig: function (id, index, callback) {
      storage.emitter.id = id;
      storage.emitter.index = index;
      storage.emitter.callback = callback;
    },
    updateViz: function () {
      storage.update++;
    }
  };

  const websocketMsgSrvMock = {
    commitParagraph: function() {storage.commit++;},
  };

  const saveAsMock = {
    saveAs: function(data, name, ext){
      storage.saveAs.data = data;
      storage.saveAs.name = name;
      storage.saveAs.ext = ext;
    },
  };

  const tableParserServiceMock = {
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

  const networkParserServiceMock = {

  };

  beforeEach(angular.mock.inject(
    function(
      $controller,
      $rootScope,
      $compile,
      baseUrlSrv
    ) {

    scope = $rootScope.$new();
    scope.$parent = $rootScope.$new(true, $rootScope);
    scope.$parent.paragraph = paragraphMock;
    compile = $compile;
    scope.graphMode = 'table';

    controller = $controller('NewResultCtrl', {
      $scope: scope,
      $rootScope: $rootScope,
      $compile: compile,
      websocketMsgSrv: websocketMsgSrvMock,
      saveAsService: saveAsMock,
      vizRegisterService: vizRegisterServiceMock,
      tableParserService: tableParserServiceMock,
      networkParserService: networkParserServiceMock,
    });
  }));

  const functions = [
    'init',
    'switchViz',
    'toggleGraphSetting',
    'exportToDSV',
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

  it('should init correctly', function() {
    //this also tests typeNormalizer(), setupSwitcher() and getVizConfig()
    scope.init(paragraphMock, 'noteid', 0);
    expect(scope.index).toEqual(0);
    expect(scope.id).toEqual('p1');
    expect(scope.data).toEqual('test');
    expect(scope.type).toEqual('TABLE');
    expect(scope.status).toEqual('SUCCESS');
    expect(scope.activeViz).toEqual('table');
    expect(scope.vizConfig).toEqual(exampleGetviz);
    expect(scope.settings).toEqual(true);
    expect(scope.inclusionpath).toEqual('some_test_path');
    expect(scope.controllerName).toEqual('testCtrl');
    expect(storage.emitter.id).toEqual('p1');
    expect(storage.emitter.index).toEqual(0);
    expect(storage.emitter.callback).toBeDefined();
    expect(scope.switcher.length).toEqual(2);
    expect(scope.noteId).toEqual('noteid');

    //it also should create the container with testCtrl,
    //which should call init in the console, but since it is async,
    //it will only show it in the main output
  });

  it('should switch viz correctly', function() {
    storage.commit = 0;
    const paragraphCopy = angular.copy(paragraphMock);
    scope.init(paragraphCopy, 'noteid', 0);
    //this should also test clearContainer() and sendConfig()
    scope.switchViz('testViz');
    expect(paragraphCopy.config.results[0].graph.mode).toEqual('not_table');
    expect(storage.commit).toEqual(1);
  });

  it('should toggle settings', function() {
    scope.settingsOpen = false;
    scope.toggleGraphSetting();
    expect(scope.settingsOpen).toBeTruthy();
  });

  it('should use SAVE AS', function() {
    spyOn(saveAsMock, 'saveAs').and.callThrough();
    scope.init(paragraphMock, 'noteid', 0);
    scope.exportToDSV(',');
    expect(saveAsMock.saveAs.calls.any());
  });

  it('should react on append broadcast', function() {
    storage.update = 0;
    const paragraphCopy = angular.copy(paragraphMock);
    let testUpdate = {
      index: 0,
      paragraphId: 'p1',
      data: 'MoreTestDataToConcat',
    };
    paragraphCopy.status = ParagraphStatus.RUNNING;
    scope.init(paragraphCopy, 'noteid', 0);
    scope.$broadcast('appendParagraphOutput', testUpdate);
    //this should also test appendTableOutput() and updateContainer()
    expect(storage.update).toEqual(1);
    expect(scope.data).toEqual('testMoreTestDataToConcat');
    //testing broadcast with different paragraph ID and index. Should be ignored
    testUpdate = {
      index: 1,
      paragraphId: 'p2',
      data: 'MoreTestDataToConcat',
    };
    scope.$broadcast('appendParagraphOutput', testUpdate); //should be ignored
    expect(storage.update).toEqual(1);
    expect(scope.data).toEqual('testMoreTestDataToConcat');
    //testing broadcast correct paragraph ID and index, but status is ERROR.
    //Should be ignored
    testUpdate = {
      index: 0,
      paragraphId: 'p1',
      data: 'MoreTestDataToConcat',
    };
    paragraphCopy.status = ParagraphStatus.ERROR;
    scope.$broadcast('appendParagraphOutput', testUpdate); //should be ignored
    expect(storage.update).toEqual(1);
    expect(scope.data).toEqual('testMoreTestDataToConcat');
  });

  it('should react on update broadcast', function() {
    storage.update = 0;
    const paragraphCopy = angular.copy(paragraphMock);
    const testResult = {
      type: 'TABLE',
      data: 'secondTestData',
    };
    scope.init(paragraphCopy, 'noteid', 0);
    scope.$broadcast('updateResult', testResult, configMock, paragraphCopy, 0);
    //this should also test updateContainer()
    expect(scope.data).toEqual('secondTestData');
    expect(storage.update).toEqual(1);
    //testing the same data update. Should be ignored
    scope.$broadcast('updateResult', testResult, configMock, paragraphCopy, 0);
    expect(storage.update).toEqual(1);
  });

});
