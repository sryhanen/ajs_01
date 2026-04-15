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
describe('Service: network parser', function() {
  beforeEach(angular.mock.module('zeppelinWebApp.networkParser'));

  let service;

  beforeEach(angular.mock.inject(function($injector) {
    service = $injector.get('networkParserService');
  }));

  const functions = [
    'loadNetworkResult',
  ];

  functions.forEach(function(fn) {
    it(`check for service functions to be defined : ${fn}`, function() {
      expect(service[fn]).toBeDefined();
    });
  });

  it('should able to create NetowrkData from paragraph result', function() {
    const jsonExpected = {
      nodes: [{id: 1}, {id: 2}],
        edges: [{source: 2, target: 1, id: 1}]
    };
    const datastring = JSON.stringify(jsonExpected);
    const result = service.loadNetworkResult(datastring);

    expect(result.columns.length).toBe(1);
    expect(result.rows.length).toBe(3);
    expect(result.graph.nodes[0].id).toBe(jsonExpected.nodes[0].id);
    expect(result.graph.nodes[1].id).toBe(jsonExpected.nodes[1].id);
    expect(result.graph.edges[0].id).toBe(jsonExpected.edges[0].id);
    expect(result.graph.edges[0].source).toBe(jsonExpected.edges[0].source);
    expect(result.graph.edges[0].target).toBe(jsonExpected.edges[0].target);
    expect(result.graph.lables).toBeUndefined(); //no lables should be there, if none defined.
  });

  it('should able to show data fields source and target', function() {
    const jsonExpected = {
      nodes: [
        {id: 1, data: {source: 'Source'}},
        {id: 2, data: {target: 'Target'}}
      ],
      edges: [
        {source: 2,
          target: 1,
          id: 1,
          data: {
            source: 'Source Edge Data',
            target: 'Target Edge Data'
          }}
      ]
    };
    const datastring = JSON.stringify(jsonExpected);
    const result = service.loadNetworkResult(datastring);

    expect(result.columns.length).toBe(3);
    expect(result.rows.length).toBe(3);
    expect(result.graph.nodes[0].id).toBe(jsonExpected.nodes[0].id);
    expect(result.graph.nodes[1].id).toBe(jsonExpected.nodes[1].id);
    expect(result.graph.edges[0].id).toBe(jsonExpected.edges[0].id);
    expect(result.graph.edges[0].source).toBe(jsonExpected.edges[0].source);
    expect(result.graph.edges[0].target).toBe(jsonExpected.edges[0].target);
    expect(result.graph.nodes[0].data.source).toBe(jsonExpected.nodes[0].data.source);
    expect(result.graph.nodes[1].data.target).toBe(jsonExpected.nodes[1].data.target);
    expect(result.graph.edges[0].data.source).toBe(jsonExpected.edges[0].data.source);
    expect(result.graph.edges[0].data.target).toBe(jsonExpected.edges[0].data.target);

  });

  it('should able to process labels', function() {
    //the data is big, since I need to test the color exaustion
    //this will also break, if more colors will be added. Right now we expect 8x3 colors MAX.
    const jsonExpected = {
      nodes: [
        {'id': 1, 'label': 'User', 'data': {'fullName':'Felix Payne'}},
        {'id': 2, 'label': 'User1', 'data': {'fullName':'Ameera Fulton'}},
        {'id': 3, 'label': 'User2', 'data': {'fullName':'Meghan Chavez'}},
        {'id': 4, 'label': 'User7', 'data': {'fullName':'Bryony Schneider'}},
        {'id': 5, 'label': 'User8', 'data': {'fullName':'Doris Dickerson'}},
        {'id': 6, 'label': 'User3', 'data': {'fullName':'Zoe Jacobs'}},
        {'id': 7, 'label': 'User4', 'data': {'fullName':'Hope Clarke'}},
        {'id': 8, 'label': 'User5', 'data': {'fullName':'Kelsie Miranda'}},
        {'id': 9, 'label': 'User6', 'data': {'fullName':'Zainab Rosales'}},
        {'id': 10, 'label': 'User9', 'data': {'fullName':'Beth Banks'}},
        {'id': 11, 'label': 'Teragrep', 'data': {'name':'Teragrep'}},
        {'id': 12, 'label': 'Project', 'data': {'name':'Test1'}},
        {'id': 13, 'label': 'Project2', 'data': {'name':'Test2'}},
        {'id': 14, 'label': 'Project3', 'data': {'name':'Test3'}},
        {'id': 15, 'label': 'Lib', 'data': {'name':'Lib1'}},
        {'id': 16, 'label': 'Lib1', 'data': {'name':'Lib2'}},
        {'id': 17, 'label': 'Lib2', 'data': {'name':'Lib3'}},
        {'id': 18, 'label': 'Lib3', 'data': {'name':'Lib1'}},
        {'id': 19, 'label': 'Lib4', 'data': {'name':'Lib2'}},
        {'id': 20, 'label': 'Lib5', 'data': {'name':'Lib3'}},
        {'id': 21, 'label': 'Lib6', 'data': {'name':'Lib1'}},
        {'id': 22, 'label': 'Lib7', 'data': {'name':'Lib2'}},
        {'id': 23, 'label': 'Lib8', 'data': {'name':'Lib3'}},
        {'id': 24, 'label': 'Lib9', 'data': {'name':'Lib1'}},
        {'id': 25, 'label': 'Project4', 'data': {'name':'Lib2'}},
        {'id': 26, 'label': 'Project5', 'data': {'name':'Lib6'}},//unique labels end here
        {'id': 27, 'label': 'Project5', 'data': {'name':'Lib7'}},
        {'id': 28, 'label': 'Project5', 'data': {'name':'Lib8'}},
      ],
      edges: [
        {'source': 12, 'target': 11, 'id' : 11, 'label': 'HELPS'},
        {'source': 13, 'target': 11, 'id' : 11, 'label': 'CREATE'},
        {'source': 14, 'target': 11, 'id' : 11, 'label': 'CONTRIBUTE_TO'},
        {'source': 1, 'target': 12, 'id' : 12, 'label': 'CONTRIBUTE_TO'},
      ]
    };
    const datastring = JSON.stringify(jsonExpected);
    const result = service.loadNetworkResult(datastring);

    expect(Object.keys(result.graph.labels).length).toBe(26);
    expect(result.graph.labels[Object.keys(result.graph.labels)[25]]).toBe('default-color'); //the palette should exaust here
  });

});
