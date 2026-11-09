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
import {ParagraphPayload} from './paragraphPayload';
import {ParagraphResponse} from '../paragraph/paragraphResponse';
import {Paragraph} from '../paragraph/paragraph';
import {WebSocketPayload} from '../../../objects/webSocket/webSocketPayload/webSocketPayload';
import {Requestable} from '../../../objects/channel/requestable';
import {ParagraphRequest} from '../paragraph/paragraphRequest';
import {OutputPayload} from '../outputPayload/outputPayload';
import {ParagraphImpl} from '../paragraph/paragraphImpl';
import {OutputPayloadImpl} from '../outputPayload/outputPayloadImpl';
import {Respondable} from '../../../objects/channel/respondable';

export class ParagraphPayloadImpl implements ParagraphPayload {
  private readonly _paragraphState:WebSocketPayload;
  private readonly _requestable: Requestable;
  private readonly _paragraphRequest:Requestable;
  private readonly _outputState: OutputPayload;
  private readonly _paragraph: Paragraph;
  private readonly _paragraphResponse:Respondable;

  constructor(paragraphState:WebSocketPayload, requestable: Requestable) {
    this._paragraphState = paragraphState;
    this._requestable = requestable;
    this._paragraphRequest = this.initializeParagraphRequest(this._requestable);
    this._outputState = this.initializeOutputState(paragraphState, this._paragraphRequest);
    this._paragraph = new ParagraphImpl(this._paragraphRequest, this._paragraphState, {output: this._outputState.asOutput()});
    this._paragraphResponse = new ParagraphResponse([this._outputState.asOutputSwitcherResponse()], this.paragraphId());
  }

  private initializeParagraphRequest(requestable: Requestable):Requestable{
    return new ParagraphRequest(requestable, this.paragraphId());
  }

  private initializeOutputState(paragraphState:WebSocketPayload, paragraphRequest:Requestable):OutputPayload{
    return new OutputPayloadImpl(paragraphState, paragraphRequest);
  }

  asParagraph(): Paragraph {
    return this._paragraph;
  }

  asParagraphResponse(): Respondable {
    return this._paragraphResponse;
  }

  private paragraphId():string {
    return this._paragraphState.stringProperty('id');
  }
}
