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
import JsonTableData from './jsonTableData';

describe('JsonTableData test suite', function() {
  const validJson = {
    headers:['col1', 'col2', 'col3'],
    data: [
      {'col1': 'x1', 'col2': 'y1', 'col3': 'z1'},
      {'col1': 'x2', 'col2': 'y2', 'col3': 'z2'},
      {'col1': 'x3', 'col2': 'y3', 'col3': 'z3'},
      {'col1': 'x4', 'col2': 'y4', 'col3': 'z4'},
    ],
    draw: 1,
    recordsTotal: 4,
    recordsFiltered: 4,
  };
  const expectedColumns = [
    {title: 'col1', data: 'col1'},
    {title: 'col2', data: 'col2'},
    {title: 'col3', data: 'col3'},
  ];

  describe('Test tableData method', function() {
    it('Json is valid data', () => {
      const expectedData = {
        data: [
          {'col1': 'x1', 'col2': 'y1', 'col3': 'z1'},
          {'col1': 'x2', 'col2': 'y2', 'col3': 'z2'},
          {'col1': 'x3', 'col2': 'y3', 'col3': 'z3'},
          {'col1': 'x4', 'col2': 'y4', 'col3': 'z4'},
        ],
        draw: 1,
        recordsTotal: 4,
        recordsFiltered: 4,
      };
      const tableData = new JsonTableData(validJson).tableData();

      expect(tableData).toEqual(expectedData);
    });
  });

  describe('Test tableColumns method', function() {
    it('Json is valid data', () => {
      const tableColumns = new JsonTableData(validJson).tableColumns();
      expect(tableColumns.displayed()).toEqual(expectedColumns);
    });

    it('Table headers are are missing', () => {
      const json = {
        draw: 1,
        data:[],
        recordsTotal: 1,
        recordsFiltered: 1,
      };
      expect(() => new JsonTableData(json).tableColumns())
        .toThrow(new Error('Table headers are undefined'));
    });
  });

  describe('Json schema is validated', function() {
    it('Data is missing', () => {
      const json = {
        draw: 1,
        recordsTotal: 1,
        recordsFiltered: 1,
      };
      expect(() => new JsonTableData(json).tableData())
        .toThrow(new Error('Data is undefined'));
    });

    it('Draw is missing', () => {
      const json = {
        data:[],
        recordsTotal: 1,
        recordsFiltered: 1,
      };
      expect(() => new JsonTableData(json).tableData())
        .toThrow(new Error('Draw value is undefined'));
    });

    it('recordsTotal is missing', () => {
      const json = {
        draw: 1,
        data:[],
        recordsFiltered: 1,
      };
      expect(() => new JsonTableData(json).tableData())
        .toThrow(new Error('recordsTotal value is undefined'));
    });

    it('recordsFiltered is missing', () => {
      const json = {
        draw: 1,
        data:[],
        recordsTotal: 1,
      };
      expect(() => new JsonTableData(json).tableData())
        .toThrow(new Error('recordsFiltered value is undefined'));
    });
  });

});
