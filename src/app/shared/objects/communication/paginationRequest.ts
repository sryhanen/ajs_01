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
import AjaxParameters from './ajaxParameters';
import {RequestParameters} from '../../types/pagination';

/**
 * Sends requests via websocketMessageService
 * @param noteId
 * @param paragraphId
 * @param websocketMessageService
 */
export default class PaginationRequest {
  private readonly _noteId: string;
  private readonly _paragraphId: string;
  private readonly _websocketMessageService;

  /**
   * Sends requests via websocketMessageService
   * @param noteId
   * @param paragraphId
   * @param websocketMessageService
   */
  constructor(noteId:string, paragraphId:string, websocketMessageService) {
    if(noteId === undefined || paragraphId === undefined) {
      throw new Error(`Expected parameters noteId:${noteId}, paragraphId:${paragraphId}, to be defined.`);
    }
    this._noteId = noteId;
    this._paragraphId = paragraphId;
    this._websocketMessageService = websocketMessageService;
  }


  /**
   * Sends pagination request if requestParameters.draw is greater than 1.
   * RequestParameters are derived from https://datatables.net/manual/server-side#Sent-parameters.
   * @param requestParameters
   */
  sendRequest(requestParameters: RequestParameters) {
    const ajaxParameters=  new AjaxParameters(requestParameters).getParameters();
    if (ajaxParameters.draw > 1)
    {
      this._websocketMessageService
        .paragraphUpdateResult(
          this._noteId, this._paragraphId,
          ajaxParameters.draw, ajaxParameters.start, ajaxParameters.length,
          ajaxParameters.search);
    }
  }
}
