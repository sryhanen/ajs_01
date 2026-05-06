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
import {uPlotView} from './uPlotView';
import {render} from '@testing-library/angular';
import {uPlotPluginImpl} from '../../../../objects/output/plugins/uPlotPlugin/uPlotPluginImpl';
import {uPlotPluginStub} from '../../../../objects/output/plugins/uPlotPlugin/uPlotPluginStub';
import {OutputPlugin} from '../../../../objects/output/plugins/outputPlugin';
import {uPlotOutputDTO} from '../../../../objects/output/plugins/uPlotPlugin/uPlotOutputDTO/uPlotOutputDTO';
import {SafeJsonImpl} from '../../../../objects/safeJson/safeJsonImpl';

describe('uPlotView', () => {
  const outputDto:uPlotOutputDTO = {
    data: [],
    options: {
      labels: [],
      series: [],
      xAxisLabel: '',
      graphType: ''
    },
    type: '',
    isAggregated: true,
  };
  const microPlotPlugin:OutputPlugin = new uPlotPluginImpl(new SafeJsonImpl(outputDto));
  const microPlotPluginStub:OutputPlugin = new uPlotPluginStub();

  describe('Birth', () => {
    it('Should be initialized', async () => {
      const {container} = await render(uPlotView, {
        inputs:{plugin:microPlotPlugin}
      });
      expect(container).toBeDefined();
    });

    it('Should throw', async () => {
      const result = render(uPlotView, {
        inputs:{plugin:microPlotPluginStub}
      });
      expect(async () => await result).rejects.toThrow();
    });
  });
});
