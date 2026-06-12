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
import {OutputContainer} from '../../../../objects/output/container/outputContainer';
import {InterpreterErrorListener} from '../../../../objects/interpreterErrorListener/interpreterErrorListener';
import {OutputFormat} from '../../../../objects/output/format/outputFormat';
import {OutputPlugin} from '../../../../objects/output/plugins/outputPlugin';
import {OutputSwitcher} from '../../../../objects/output/switcher/outputSwitcher';
import {FakeOutputPlugin} from '../../../../objects/output/fakeOutputPlugin';
import {OutputPluginStub} from '../../../../objects/output/plugins/outputPluginStub';
import {OutputSwitcherImpl} from '../../../../objects/output/switcher/outputSwitcherImpl';
import {Channel} from '../../../../objects/channel/channel';
import {FakeChannel} from '../../../../objects/channel/fakeChannel';
import {OutputContainerAngularImpl} from './outputContainerAngularImpl';
import {OutputSwitcherAngularImpl} from '../switcher/outputSwitcherAngularImpl';


describe('OutputContainerAngular implementation unit test', () => {
  let channel:Channel;
  let outputContainer:OutputContainer;
  let outputContainerAngular: OutputContainer;
  let outputPlugin: OutputPlugin;
  let outputSwitcher: OutputSwitcher;

  beforeEach(() => {
    channel = new FakeChannel();
    outputSwitcher = new OutputSwitcherImpl(channel);
    outputPlugin = new OutputPluginStub();
    outputContainer = {
      errorListener(): InterpreterErrorListener {
        return {} as InterpreterErrorListener;
      },
      outputFormats(): OutputFormat[] {
        return [];
      },
      outputPlugin(): OutputPlugin {
        return outputPlugin;
      },
      outputSwitcher(): OutputSwitcher {
        return outputSwitcher;
      },
      request(): void {},
      response(): void {
        outputPlugin = new FakeOutputPlugin();
      }
    };
    outputContainerAngular = new OutputContainerAngularImpl(outputContainer);
  });

  describe('Birth', () => {
    it('Should be initialized', () => {
      expect(outputContainerAngular).toBeDefined();
    });

    it('Should have OutputPlugin stub', () => {
      expect(outputContainerAngular.outputPlugin().isStub()).toBe(true);
    });

    it('Should have OutputSwitcherAngular implementation', () => {
      expect(outputContainerAngular.outputSwitcher()).toBeInstanceOf(OutputSwitcherAngularImpl);
    });

    it('Should have empty list of outputFormats', () => {
      expect(outputContainerAngular.outputFormats()).toEqual([]);
    });

    it('Should have ErrorListener', () => {
      expect(outputContainerAngular.errorListener()).toBeDefined();
    });
  });

  describe('Request', () => {
    it('Should request OutputContainer', () => {
      const request = {op:'', data:{}};
      const requestSpy = vi.spyOn(outputContainer, 'request');
      outputContainerAngular.request(request);
      expect(requestSpy).toHaveBeenCalledExactlyOnceWith(request);
    });
  });

  describe('Response', () => {
    const response = {op:'', data:{}};
    let outputSwitcherResponseSpy;

    beforeEach(() => {
      outputSwitcherResponseSpy = vi.spyOn(outputContainerAngular.outputSwitcher(), 'response');
      outputContainer.response(response);
      outputContainerAngular.response(response);
    });

    it('Should have updated OutputPlugin', () => {
      expect(outputContainerAngular.outputPlugin().isStub()).toBe(false);
    });

    it('Should have responded OutputSwitcher', () => {
      expect(outputSwitcherResponseSpy).toHaveBeenCalledExactlyOnceWith(response);
    });
  });
});
