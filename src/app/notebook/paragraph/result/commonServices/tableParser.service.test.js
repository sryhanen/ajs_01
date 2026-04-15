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
describe('Service: table parser', function() {
  beforeEach(angular.mock.module('zeppelinWebApp.tableParser'));

  let service;
  const testInput = 'Year\tMajorRegion\tDebt\tInterest\n' +
    '2017\tCapital district\t32361827439\t356942344\n' +
    '2018\tCapital district\t33673670582\t363897717\n' +
    '2019\tCapital district\t35664567321\t359372212\n' +
    '2020\tCapital district\t38339816588\t354182353\n' +
    '2021\tCapital district\t40634831854\t340774017\n' +
    '2017\tOther Helsinki-Uusimaa\t14309514948\t186658249\n' +
    '2018\tOther Helsinki-Uusimaa\t14308236595\t186920301\n' +
    '2019\tOther Helsinki-Uusimaa\t14497554181\t185074538\n' +
    '2020\tOther Helsinki-Uusimaa\t14912291410\t183900462\n' +
    '2021\tOther Helsinki-Uusimaa\t15189364403\t176285153\n' +
    '2017\tSouthern Finland\t24347560556\t351517478\n' +
    '2018\tSouthern Finland\t24118445230\t348997937\n' +
    '2019\tSouthern Finland\t24237252979\t340141033\n' +
    '2020\tSouthern Finland\t24617971549\t336329960\n' +
    '2021\tSouthern Finland\t24597488869\t321467164\n' +
    '2017\tWestern Finland\t29694160275\t432811536\n' +
    '2018\tWestern Finland\t29669804450\t429189639\n' +
    '2019\tWestern Finland\t30046575715\t417401860\n' +
    '2020\tWestern Finland\t30771051048\t411036590\n' +
    '2021\tWestern Finland\t30931924721\t391160443\n' +
    '2017\tNorthern and Eastern Finland\t24822234550\t371227446\n' +
    '2018\tNorthern and Eastern Finland\t24518231111\t368102148\n' +
    '2019\tNorthern and Eastern Finland\t24518889505\t357248067\n' +
    '2020\tNorthern and Eastern Finland\t24770339984\t351755686\n' +
    '2021\tNorthern and Eastern Finland\t24574359105\t332940978\n' +
    '2017\tÅland\t1026593326\t12971445\n' +
    '2018\tÅland\t1042153311\t13414334\n' +
    '2019\tÅland\t1068396604\t13112285\n' +
    '2020\tÅland\t1083875022\t12881023\n' +
    '2021\tÅland\t1080111682\t11971512\n\nhelloTest';

  beforeEach(angular.mock.inject(function($injector) {
    service = $injector.get('tableParserService');
  }));

  const functions = [
    'loadTableResult',
  ];

  functions.forEach(function(fn) {
    it(`check for service functions to be defined : ${fn}`, function() {
      expect(service[fn]).toBeDefined();
    });
  });

  it('should parse the data', function() {
    const parsed = service.loadTableResult(testInput);
    expect(parsed.columns.length).toBe(4);
    expect(parsed.rows.length).toBe(30);
    expect(parsed.comment).toBe('helloTest');
  });

});
