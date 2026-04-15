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
import DataTableData from './dataTableData';

describe('DataTableData test suite', function() {
  const data= 'col1\tcol2\tcol3\nx1\ty1\tz1\nx2\ty2\tz2\nx3\ty3\tz3\nx4\ty4\tz4\n';
  const expectedColumns = [
    {title: 'col1', data: 'col1'},
    {title: 'col2', data: 'col2'},
    {title: 'col3', data: 'col3'},
  ];
  const expectedData = [
    {'col1': 'x1', 'col2': 'y1', 'col3': 'z1'},
    {'col1': 'x2', 'col2': 'y2', 'col3': 'z2'},
    {'col1': 'x3', 'col2': 'y3', 'col3': 'z3'},
    {'col1': 'x4', 'col2': 'y4', 'col3': 'z4'},
  ];

  describe('Test tableData method', function() {
    it('Expected outcome with expected string data', () => {
      const tableData = new DataTableData(data);
      expect(tableData.tableColumns().displayed()).toEqual(expectedColumns);
      expect(tableData.tableData()).toEqual(expectedData);
    });

    it('Expected outcome with empty string', () => {
      const tableData = new DataTableData('');
      const emptyData = [];
      const emptyColumns = [{title: '', data: ''}];
      expect(tableData.tableData()).toEqual(emptyData);
      expect(tableData.tableColumns().displayed()).toEqual(emptyColumns);
    });
  });
});
