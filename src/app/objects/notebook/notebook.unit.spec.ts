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
import {Notebook} from './notebook';
import {Requestable} from '../channel/requestable';
import {Respondable} from '../channel/respondable';
import {WebSocketPayload} from '../webSocket/webSocketPayload/webSocketPayload';
import {signal, Signal} from '@angular/core';
import {RenderNode} from '../rendering/renderNode/renderNode';
import {ChannelFake} from '../../../test/fakes/client/channel/channelFake';
import {WebSocketPayloadImpl} from '../webSocket/webSocketPayload/webSocketPayloadImpl';
import {RenderNodeFake} from '../../../test/fakes/client/renderNode/renderNodeFake';
import {NotebookImpl} from './notebookImpl';

describe('Notebook unit test', () => {
  let notebook: Notebook;
  let requestable: Requestable;
  let respondable:Respondable;
  let notebookState: WebSocketPayload;
  let renderNode: Signal<RenderNode>;

  it('Should print', () => {
    requestable = new ChannelFake();
    respondable = new ChannelFake();
    notebookState = new WebSocketPayloadImpl({});
    renderNode = signal(new RenderNodeFake());
    notebook = new NotebookImpl(requestable, respondable, notebookState, renderNode);
    expect(notebook.print()()).toEqual(renderNode());
  });


});
