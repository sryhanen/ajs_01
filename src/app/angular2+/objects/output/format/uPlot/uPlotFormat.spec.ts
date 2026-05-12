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
import {uPlotFormat} from './uPlotFormat';
import {OutputType} from '../../outputType';
import {ContainerRef} from '../../../containerRef/containerRef';
import {FakeContainerRef} from '../../../containerRef/fakeContainerRef';

describe('uPlotFormat', () => {
  let microPlotFormat: uPlotFormat;
  beforeEach(async () => {
    microPlotFormat = new uPlotFormat();
  });

  describe('Birth', ()=> {
    it('Should be initialized', () => {
      expect(microPlotFormat).toBeDefined();
    });

    it('Should have switcher buttons', () => {
      const switcherButtons = microPlotFormat.switcherButtons();
      expect(switcherButtons).toHaveLength(4);
    });

    it('Should have outputType', () => {
      expect(microPlotFormat.outputType()).toEqual(OutputType.uPlot);
    });
  });

  describe('Rendering', ()=> {
    let containerRef: ContainerRef;
    let createComponentSpy;
    let clearComponentSpy;
    let outputData: {
      data: [][],
      options: object
    };
    beforeEach(() => {
      outputData = {
        data:[],
        options: {}
      };
      containerRef = new FakeContainerRef();
      createComponentSpy = vi.spyOn(containerRef, 'createComponent');
      clearComponentSpy = vi.spyOn(containerRef, 'clear');
      expect(createComponentSpy).toHaveBeenCalledTimes(0);
      expect(clearComponentSpy).toHaveBeenCalledTimes(0);
    });

    it('Should create component', () => {
      microPlotFormat.pushContainerRef(containerRef);
      microPlotFormat.render(outputData);
      expect(createComponentSpy).toHaveBeenCalledOnce();
    });

    it('Should clear component', () => {
      microPlotFormat.pushContainerRef(containerRef);
      microPlotFormat.clear();
      expect(clearComponentSpy).toHaveBeenCalledOnce();
    });

    it('Should create component if render has been evoked', () => {
      microPlotFormat.render(outputData);
      microPlotFormat.pushContainerRef(containerRef);
      expect(createComponentSpy).toHaveBeenCalledOnce();
    });

    it('Should not create component if render and clear have been evoked', () => {
      microPlotFormat.render(outputData);
      microPlotFormat.clear();
      microPlotFormat.pushContainerRef(containerRef);
      expect(createComponentSpy).toHaveBeenCalledTimes(0);
    });
  });
});
