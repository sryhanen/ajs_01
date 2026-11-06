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
import {Respondable} from '../../../objects/channel/respondable';
import {WebSocketResponseImpl} from '../../../objects/webSocket/response/webSocketResponseImpl';
import {WebSocketPayloadImpl} from '../../../objects/webSocket/webSocketPayload/webSocketPayloadImpl';
import {WebSocketResponse} from '../../../objects/webSocket/response/webSocketResponse';
import {Requestable} from '../../../objects/channel/requestable';
import {NotebookIndex} from './notebookIndex';
import {NotebookImpl} from '../notebook/notebookImpl';
import {ParagraphCollectionImpl} from '../paragraphCollection/paragraphCollectionImpl';
import {NotebookResponse} from '../notebook/notebookResponse';
import {ParagraphCollectionResponse} from '../paragraphCollection/paragraphCollectionResponse';
import {NotebookRequest} from '../notebook/notebookRequest';
import {ParagraphRequest} from '../paragraph/paragraphRequest';
import {OutputResponse} from '../output/outputResponse';
import {ParagraphResponse} from '../paragraph/paragraphResponse';
import {Assembler} from '../assembler/assembler';
import {AssemblerImpl} from '../assembler/assemblerImpl';
import {OutputSwitcherResponse} from '../outputSwitcher/outputSwitcherResponse';
import {OutputSwitcherRequestImpl} from '../outputSwitcher/outputSwitcherRequestImpl';
import {OutputSwitcherImpl} from '../outputSwitcher/outputSwitcherImpl';
import {SwitcherButton} from '../outputSwitcher/switcherButton/switcherButton';
import {OutputType} from '../../../objects/output/outputType';
import {GraphType} from '../outputFormat/uPlot/graphType';
import {SwitcherButtonImpl} from '../outputSwitcher/switcherButton/switcherButtonImpl';
import {SwitchIndicatorImpl} from '../outputSwitcher/switchIndicator/switchIndicatorImpl';

export class NotebookIndexResponse implements Respondable {
  private readonly _notebookIndex:NotebookIndex;
  private readonly _respondables: Respondable[];
  private readonly _notebookId:string;
  private readonly _requestable: Requestable;
  private readonly _assembler:Assembler;

  constructor(notebookIndex:NotebookIndex, respondables: Respondable[], notebookId:string, requestable: Requestable) {
    this._notebookIndex = notebookIndex;
    this._respondables = respondables;
    this._notebookId = notebookId;
    this._requestable = requestable;
    this._assembler = new AssemblerImpl();
  }

  response(json: object): void {
    const webSocketResponse = new WebSocketResponseImpl(new WebSocketPayloadImpl(json));
    if(webSocketResponse.operation() === 'NOTE'){
      this.handleNoteResponseEvent(webSocketResponse);
    }
    else{
      this._respondables.forEach(respondable => respondable.response(json));
    }
  }

  private handleNoteResponseEvent(webSocketResponse: WebSocketResponse): void {
    const notebookState = webSocketResponse.dataAsWebSocketPayload();
    const receivedNotebookId = notebookState.stringProperty('id');
    if(receivedNotebookId === this._notebookId){
      const paragraphCollection = new ParagraphCollectionImpl();
      const paragraphs = notebookState.arrayProperty<object>('paragraphs');
      const notebook = new NotebookImpl(notebookState, {paragraphCollection: paragraphCollection});
      this._notebookIndex.openNotebook(notebook);
      const notebookRequest = new NotebookRequest(this._requestable, receivedNotebookId);
      const paragraphResponses: Map<string, Respondable> = new Map();
      let paragraphIndex = 0;
      for(const paragraphPayload of paragraphs){
        const paragraphState = new WebSocketPayloadImpl(paragraphPayload);
        const paragraphId = paragraphState.stringProperty('id');
        const paragraphRequest = new ParagraphRequest(notebookRequest, paragraphId);
        const switchIndicator = new SwitchIndicatorImpl();
        const outputSwitcherRequest = new OutputSwitcherRequestImpl(paragraphRequest, switchIndicator);
        const outputSwitcher = new OutputSwitcherImpl(this.switcherButtons(outputSwitcherRequest), switchIndicator);
        const output = this._assembler.output(outputSwitcherRequest, outputSwitcher);
        const paragraph = this._assembler.paragraph(paragraphState, paragraphRequest, {output:output});
        const outputResponse = new OutputResponse(output);
        this._assembler.initializeOutput(paragraphState, outputResponse);
        const outputSwitcherResponse = new OutputSwitcherResponse(outputSwitcherRequest, [outputResponse], switchIndicator);
        const paragraphResponse = new ParagraphResponse([outputSwitcherResponse], paragraphId);
        paragraphResponses.set(paragraphId, paragraphResponse);
        paragraphCollection.addParagraph(paragraph, paragraphIndex);
        paragraphIndex += 1;
      }
      const paragraphCollectionResponse = new ParagraphCollectionResponse(notebookRequest, paragraphResponses, paragraphCollection);
      const notebookResponse = new NotebookResponse([paragraphCollectionResponse], receivedNotebookId);
      this._respondables.push(notebookResponse);
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
