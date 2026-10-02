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
import {ParagraphOutputMessage} from './paragraphOutputMessage';
import {ParagraphOutputMessageImpl} from './paragraphOutputMessageImpl';
import {WebSocketPayloadImpl} from '../../webSocketPayload/webSocketPayloadImpl';
import {MessageImpl} from '../messageImpl';
import {ParagraphOutputServerResponse} from '../../../../test/fakes/webSocketServerResponses/paragraphOutput/paragraphOutputServerResponse';
import {FakeOutputPayloadFactoryImpl} from '../../../../test/fakes/output/fakeOutputPayloadFactoryImpl';
import {Output} from '../../output/output';
import {Signal} from '@angular/core';
import {RenderNode} from '../../rendering/renderNode/renderNode';
import {FakeOutputPayloadFactory} from '../../../../test/fakes/output/fakeOutputPayloadFactory';
import {OutputType} from '../../output/outputType';
import {DataTablesDataFactoryImpl} from '../../../../test/fakes/output/dataTables/dataTablesDataFactoryImpl';
import {uPlotDataFactoryImpl} from '../../../../test/fakes/output/uPlot/uPlotDataFactoryImpl';
import {OutputSwitcher} from '../../output/switcher/outputSwitcher';
import {OutputSwitcherImpl} from '../../output/switcher/outputSwitcherImpl';

describe('ParagraphOutputMessage unit test', () => {
  const paragraphId = 'paragraphId';
  const noteId = 'noteId';
  let paragraphOutputMessage: ParagraphOutputMessage;
  let fakeOutput:Output;
  const fakeOutputPayloadFactory:FakeOutputPayloadFactory = new FakeOutputPayloadFactoryImpl();
  let paragraphOutputServerResponse:ParagraphOutputServerResponse;

  beforeEach(() => {
    fakeOutput = {
      render:  vi.fn(),
      print(): Signal<RenderNode> {
        return undefined;
      },
      request(json: object): void {},
      response(json: object): void {}
    };
  });

  describe('Text Output', () => {
    const textData = 'text data';
    const outputPayload = fakeOutputPayloadFactory.textOutputPayload(textData);

    beforeEach(() => {
      paragraphOutputServerResponse = new ParagraphOutputServerResponse(paragraphId, noteId, outputPayload);
      paragraphOutputMessage = new ParagraphOutputMessageImpl(new MessageImpl(new WebSocketPayloadImpl(paragraphOutputServerResponse.toObject())));
    });

    it('Should render', () => {
      paragraphOutputMessage.renderOutput(fakeOutput);
      expect(fakeOutput.render).toHaveBeenCalledExactlyOnceWith(outputPayload);
    });

    it('Should have output type', () => {
      expect(paragraphOutputMessage.outputType()).toEqual(OutputType.text);
    });
  });

  describe('Html Output', () => {
    const htmlTemplate = '<div>test</div>';
    const outputPayload = fakeOutputPayloadFactory.htmlOutputPayload(htmlTemplate);

    beforeEach(() => {
      paragraphOutputServerResponse = new ParagraphOutputServerResponse(paragraphId, noteId, outputPayload);
      paragraphOutputMessage = new ParagraphOutputMessageImpl(new MessageImpl(new WebSocketPayloadImpl(paragraphOutputServerResponse.toObject())));
    });

    it('Should render', () => {
      paragraphOutputMessage.renderOutput(fakeOutput);
      expect(fakeOutput.render).toHaveBeenCalledExactlyOnceWith(outputPayload);
    });

    it('Should have output type', () => {
      expect(paragraphOutputMessage.outputType()).toEqual(OutputType.html);
    });
  });

  describe('Angular Output', () => {
    const htmlTemplate = '<div>{{test}}</div>';
    const outputPayload = fakeOutputPayloadFactory.angularOutputPayload(htmlTemplate);

    beforeEach(() => {
      paragraphOutputServerResponse = new ParagraphOutputServerResponse(paragraphId, noteId, outputPayload);
      paragraphOutputMessage = new ParagraphOutputMessageImpl(new MessageImpl(new WebSocketPayloadImpl(paragraphOutputServerResponse.toObject())));
    });

    it('Should render', () => {
      paragraphOutputMessage.renderOutput(fakeOutput);
      expect(fakeOutput.render).toHaveBeenCalledExactlyOnceWith(outputPayload);
    });

    it('Should have output type', () => {
      expect(paragraphOutputMessage.outputType()).toEqual(OutputType.angular);
    });
  });

  describe('DataTables Output Server Response', () => {
    const dataTablesDataFactory = new DataTablesDataFactoryImpl();
    const rowCount = 10;
    const rawData= dataTablesDataFactory.rawData(rowCount);
    const start = 0;
    const length = 10;
    const draw = 1;
    const dataTablesData = dataTablesDataFactory.paginatedData(rawData, start, length, draw);
    const outputPayload = fakeOutputPayloadFactory.dataTablesOutputPayload(dataTablesData);

    beforeEach(() => {
      paragraphOutputServerResponse = new ParagraphOutputServerResponse(paragraphId, noteId, outputPayload);
      paragraphOutputMessage = new ParagraphOutputMessageImpl(new MessageImpl(new WebSocketPayloadImpl(paragraphOutputServerResponse.toObject())));
    });

    it('Should render', () => {
      paragraphOutputMessage.renderOutput(fakeOutput);
      expect(fakeOutput.render).toHaveBeenCalledExactlyOnceWith(outputPayload);
    });

    it('Should have output type', () => {
      expect(paragraphOutputMessage.outputType()).toEqual(OutputType.dataTables);
    });
  });

  describe('uPlot Output Server Response', () => {
    const uPlotDataFactory = new uPlotDataFactoryImpl();
    const seriesCount = 3;
    const seriesLength = 10;
    const uPlotAlignedData = uPlotDataFactory.uPlotAlignedData(seriesCount, seriesLength);
    const graphType = 'graphType';
    const outputPayload = fakeOutputPayloadFactory.uPlotOutputPayload(uPlotAlignedData, graphType);

    beforeEach(() => {
      paragraphOutputServerResponse = new ParagraphOutputServerResponse(paragraphId, noteId, outputPayload);
      paragraphOutputMessage = new ParagraphOutputMessageImpl(new MessageImpl(new WebSocketPayloadImpl(paragraphOutputServerResponse.toObject())));
    });

    it('Should render', () => {
      paragraphOutputMessage.renderOutput(fakeOutput);
      expect(fakeOutput.render).toHaveBeenCalledExactlyOnceWith(outputPayload);
    });

    it('Should have output type', () => {
      expect(paragraphOutputMessage.outputType()).toEqual(OutputType.uPlot);
    });
  });

  describe('Updating switcher', () => {
    let outputSwitcher:OutputSwitcher;

    beforeEach(() => {
      outputSwitcher = new OutputSwitcherImpl([]);
    });

    it('Should set loader and switcher visibility', () => {
      outputSwitcher.toggleLoader(true);
      const outputIsAggregated = {
        data:{},
        type:'',
        isAggregated: true,
      };
      const paragraphOutputServerResponse = new ParagraphOutputServerResponse(paragraphId, noteId, outputIsAggregated);

      paragraphOutputMessage = new ParagraphOutputMessageImpl(new MessageImpl(new WebSocketPayloadImpl(paragraphOutputServerResponse.toObject())));
      const switcherPrinted = outputSwitcher.print()();
      const loaderBeforeUpdate = switcherPrinted.inputs()()['loaderIsVisible'];
      const switcherBeforeUpdate = switcherPrinted.inputs()()['switcherIsVisible'];
      paragraphOutputMessage.updateSwitcher(outputSwitcher);
      const loaderAfterUpdate = switcherPrinted.inputs()()['loaderIsVisible'];
      const switcherAfterUpdate = switcherPrinted.inputs()()['switcherIsVisible'];

      expect(loaderBeforeUpdate).toBe(true);
      expect(switcherBeforeUpdate).toBe(false);
      expect(loaderAfterUpdate).toBe(false);
      expect(switcherAfterUpdate).toBe(true);
    });
  });
});
