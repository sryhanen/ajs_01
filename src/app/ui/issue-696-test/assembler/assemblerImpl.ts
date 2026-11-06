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
import {Assembler} from './assembler';
import {Paragraph} from '../paragraph/paragraph';
import {Requestable} from '../../../objects/channel/requestable';
import {ParagraphRequest} from '../paragraph/paragraphRequest';
import {WebSocketPayload} from '../../../objects/webSocket/webSocketPayload/webSocketPayload';
import {OutputFormat} from '../outputFormat/outputFormat';
import {OutputType} from '../../../objects/output/outputType';
import {UPlotFormat} from '../outputFormat/uPlot/uPlotFormat';
import {TextFormat} from '../outputFormat/text/textFormat';
import {DataTablesFormat} from '../outputFormat/dataTable/dataTablesFormat';
import {OutputImpl} from '../output/outputImpl';
import {Output} from '../output/output';
import {ParagraphImpl} from '../paragraph/paragraphImpl';
import {OutputPayload} from '../output/outputPayload';
import {Respondable} from '../../../objects/channel/respondable';
import {ParagraphResponse} from '../paragraph/paragraphResponse';
import {SwitchIndicatorImpl} from '../outputSwitcher/switchIndicator/switchIndicatorImpl';
import {OutputSwitcherRequestImpl} from '../outputSwitcher/outputSwitcherRequestImpl';
import {OutputSwitcherImpl} from '../outputSwitcher/outputSwitcherImpl';
import {OutputResponse} from '../output/outputResponse';
import {OutputSwitcherResponse} from '../outputSwitcher/outputSwitcherResponse';
import {SwitcherButton} from '../outputSwitcher/switcherButton/switcherButton';
import {GraphType} from '../outputFormat/uPlot/graphType';
import {SwitcherButtonImpl} from '../outputSwitcher/switcherButton/switcherButtonImpl';

export class AssemblerImpl implements Assembler {
  paragraphNode(paragraphState:WebSocketPayload, requestable:Requestable): {paragraph:Paragraph, paragraphResponse:Respondable}{
    const paragraphId = paragraphState.stringProperty('id');
    const paragraphRequest = new ParagraphRequest(requestable, paragraphId);
    const outputAssembled = this.output(paragraphRequest, paragraphState);
    const paragraph = this.paragraph(paragraphState, paragraphRequest, {output:outputAssembled.output});
    const paragraphResponse = new ParagraphResponse([outputAssembled.outputResponse], paragraphId);
    return {paragraph:paragraph, paragraphResponse:paragraphResponse};
  }

  private output(requestable:Requestable, paragraphState:WebSocketPayload):{output:Output, outputResponse:Respondable}{
    const switchIndicator = new SwitchIndicatorImpl();
    const outputSwitcherRequest = new OutputSwitcherRequestImpl(requestable, switchIndicator);
    const outputSwitcher = new OutputSwitcherImpl(this.switcherButtons(outputSwitcherRequest),switchIndicator);
    const outputFormatsList:[string, OutputFormat][] = [
      [OutputType.uPlot, new UPlotFormat()],
      [OutputType.text, new TextFormat()],
      [OutputType.dataTables, new DataTablesFormat(requestable)],
    ];
    const outputFormats = new Map(outputFormatsList);
    const output = new OutputImpl(outputFormats, {interpreterErrorListener:{}, outputSwitcher:outputSwitcher});
    const outputResponse = new OutputResponse(output);
    this.initializeOutput(paragraphState, output);
    const outputSwitcherResponse = new OutputSwitcherResponse(outputSwitcherRequest, [outputResponse], switchIndicator);
    return {
      output:output, outputResponse:outputSwitcherResponse,
    };
  }

  private paragraph(paragraphState:WebSocketPayload, requestable:Requestable, childNodes: {output: Output}): Paragraph {
    const paragraphId = paragraphState.stringProperty('id');
    const paragraphRequest = new ParagraphRequest(requestable, paragraphId);
    return new ParagraphImpl(paragraphRequest, paragraphState, childNodes);
  }

  private initializeOutput(paragraphState: WebSocketPayload, output:Output):void{
    if (paragraphState.propertyExists('output')) {
      const outputState = paragraphState.objectProperty('output') as OutputPayload;
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
