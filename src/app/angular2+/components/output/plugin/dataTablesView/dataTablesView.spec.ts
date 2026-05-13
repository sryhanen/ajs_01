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
import {Channel} from '../../../../objects/channel/channel';
import {FakeChannel} from '../../../../objects/channel/fakeChannel';
import {DataTablesPluginImpl} from '../../../../objects/output/plugins/dataTablesPlugin/dataTablesPluginImpl';
import {DataTablesView} from './dataTablesView';
import {render, screen} from '@testing-library/angular';
import {DataTablesPluginStub} from '../../../../objects/output/plugins/dataTablesPlugin/dataTablesPluginStub';

describe('DataTablesView', () => {
  const channel:Channel = new FakeChannel();
  const header1 = 'key1';
  const header2 = 'key.with.dot';
  const outputData ={
    data: [
      {'key1':'key1 row1', 'key.with.dot': 'key.with.dot row1'},
      {'key1':'key1 row2', 'key.with.dot': 'key.with.dot row2'},
    ],
    draw: 1,
    recordsTotal: 2,
    recordsFiltered: 2
  };
  const outputOptions = {
    headers: [header1, header2]
  };

  const dataTablesPlugin = new DataTablesPluginImpl(channel, outputData, outputOptions);
  const dataTablesPluginStub = new DataTablesPluginStub();

  describe('Birth', () =>{
    test('Should be initialized', async () => {
      const {container} = await render(DataTablesView, {
        inputs:{plugin: dataTablesPlugin}
      });
      expect(container).toBeDefined();
      const table = screen.getByRole('table');
      const headers = screen.getAllByRole('columnheader');
      expect(table).toBeDefined();
      expect(headers).toHaveLength(2);
      expect(screen.getByText(header1)).toBeDefined();
      expect(screen.getByText(header2)).toBeDefined();
    });

    test('Should throw', async () => {
      const result = render(DataTablesView, {
        inputs:{plugin: dataTablesPluginStub}
      });
      expect(async () => await result).rejects.toThrow();
    });
  });
});
