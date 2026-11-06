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
import {OutputPayload} from './outputPayload';
import {Respondable} from '../../../objects/channel/respondable';
import {Output} from '../output/output';
import {OutputImpl} from '../output/outputImpl';
import {OutputFormat} from '../outputFormat/outputFormat';
import {OutputType} from '../../../objects/output/outputType';
import {UPlotFormat} from '../outputFormat/uPlot/uPlotFormat';
import {TextFormat} from '../outputFormat/text/textFormat';
import {DataTablesFormat} from '../outputFormat/dataTable/dataTablesFormat';
import {Requestable} from '../../../objects/channel/requestable';
import {SwitchIndicatorImpl} from '../outputSwitcher/switchIndicator/switchIndicatorImpl';
import {OutputSwitcherRequestImpl} from '../outputSwitcher/outputSwitcherRequestImpl';
import {OutputSwitcherImpl} from '../outputSwitcher/outputSwitcherImpl';
import {SwitcherButton} from '../outputSwitcher/switcherButton/switcherButton';
import {GraphType} from '../outputFormat/uPlot/graphType';
import {SwitcherButtonImpl} from '../outputSwitcher/switcherButton/switcherButtonImpl';
import {WebSocketPayload} from '../../../objects/webSocket/webSocketPayload/webSocketPayload';
import {OutputResponse} from '../output/outputResponse';
import {OutputSwitcherResponse} from '../outputSwitcher/outputSwitcherResponse';
import {OutputSwitcherRequest} from '../outputSwitcher/outputSwitcherRequest';
import {SwitchIndicator} from '../outputSwitcher/switchIndicator/switchIndicator';
import {OutputState} from '../output/outputState';

export class OutputPayloadImpl implements OutputPayload {
  private readonly _requestable:Requestable;
  private readonly _output:Output;
  private readonly _outputSwitcherRequest:OutputSwitcherRequest;
  private readonly _switchIndicator:SwitchIndicator;
  private readonly _outputSwitcherResponse:Respondable;

  constructor(paragraphState:WebSocketPayload, requestable:Requestable) {
    this._requestable = requestable;
    this._switchIndicator = new SwitchIndicatorImpl();
    this._outputSwitcherRequest = this.initializeOutputSwitcherRequest(this._switchIndicator);
    this._output = this.initializeOutput(paragraphState, this._outputSwitcherRequest, this._switchIndicator);
    this._outputSwitcherResponse = new OutputSwitcherResponse(this._outputSwitcherRequest, [new OutputResponse(this._output)], this._switchIndicator);
  }

  asOutput(): Output {
    return this._output;
  }

  asOutputResponse(): Respondable {
    return this._outputSwitcherResponse;
  }

  private initializeOutputSwitcherRequest(switchIndicator:SwitchIndicator):OutputSwitcherRequest {
    return new OutputSwitcherRequestImpl(this._requestable, switchIndicator);
  }

  private initializeOutput(paragraphState: WebSocketPayload, outputSwitcherRequest:OutputSwitcherRequest,switchIndicator:SwitchIndicator):Output {
    const outputSwitcher = new OutputSwitcherImpl(this.switcherButtons(outputSwitcherRequest),switchIndicator);
    const outputFormatsList:[string, OutputFormat][] = [
      [OutputType.uPlot, new UPlotFormat()],
      [OutputType.text, new TextFormat()],
      [OutputType.dataTables, new DataTablesFormat(this._requestable)],
    ];
    const outputFormats = new Map(outputFormatsList);
    const output = new OutputImpl(outputFormats, {interpreterErrorListener:{}, outputSwitcher:outputSwitcher});
    this.initializeOutputWithData(paragraphState, output);
    return output;
  }

  private initializeOutputWithData(paragraphState: WebSocketPayload, output:Output):void{
    if (paragraphState.propertyExists('output')) {
      const outputState = paragraphState.objectProperty('output') as OutputState;
      if (outputState['data'] === undefined || outputState['type'] === undefined) {
        console.error(`Output data not processed, format invalid: ${JSON.stringify(outputState)}`);
      }
      else{
        output.render(outputState);
      }
    }
  }

  private switcherButtons(requestable:Requestable):SwitcherButton[]{
    const datatablesSwitch = {
      op:'PARAGRAPH_OUTPUT_REQUEST',
      data: {
        noteId:'',
        paragraphId:'',
        type: OutputType.dataTables,
        requestOptions:{
          draw: 1,
          start: 0,
          length: 50
        }
      }
    };
    const uPlotSwitch = {
      op:'PARAGRAPH_OUTPUT_REQUEST',
      data:{
        paragraphId: '',
        noteId: '',
        type: OutputType.uPlot,
        requestOptions: {graphType: GraphType.bar}
      }
    };
    return [
      new SwitcherButtonImpl(datatablesSwitch, requestable),
      new SwitcherButtonImpl(uPlotSwitch, requestable)
    ];
  }
}
