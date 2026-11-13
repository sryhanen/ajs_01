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
import {FakeChannel} from '../channel/fakeChannel';
import {Channel} from '../channel/channel';
import {Notebook} from './notebook';
import {NotebookImpl} from './notebookImpl';
import {WebSocketPayloadImpl} from '../webSocket/webSocketPayload/webSocketPayloadImpl';
import {ParagraphCollectionFake} from '../../../test/fakes/app/paragraphCollection/paragraphCollectionFake';
import {ServerNotebookFakeImpl} from '../../../test/fakes/server/notebook/serverNotebookFakeImpl';
import {IdFakeImpl} from '../../../test/fakes/server/id/idFakeImpl';
import {RenderNode} from '../rendering/renderNode/renderNode';

describe('Notebook unit test', () => {
  const notebookId = 'noteId';
  let channel: Channel;
  let notebook: Notebook;

  it('Should have id', () => {
    channel = new FakeChannel();
    const notebookState = new ServerNotebookFakeImpl(new IdFakeImpl(notebookId)).notebookState();
    notebook = new NotebookImpl(channel, new WebSocketPayloadImpl(notebookState));
    expect(notebook.id()).toEqual(notebookId);
  });

  it('Should print RenderNode', () => {
    channel = new FakeChannel();
    const notebookState = new ServerNotebookFakeImpl(new IdFakeImpl(notebookId)).notebookState();
    notebook = new NotebookImpl(channel, new WebSocketPayloadImpl(notebookState));
    const renderNode:RenderNode = notebook.print()();
    expect(renderNode.isStub()).toBe(false);
  });

  it('Should print ParagraphCollection', () => {
    channel = new FakeChannel();
    const notebookState = new ServerNotebookFakeImpl(new IdFakeImpl(notebookId)).notebookState();
    notebook = new NotebookImpl(channel, new WebSocketPayloadImpl(notebookState));
    const paragraphCollection = notebook.print()().inputs()()['paragraphCollection'];
    expect(paragraphCollection).toBeDefined();
  });

  it('Should decorate request with noteId', () => {
    channel = new FakeChannel();
    const notebookState = new ServerNotebookFakeImpl(new IdFakeImpl(notebookId)).notebookState();
    notebook = new NotebookImpl(channel, new WebSocketPayloadImpl(notebookState));
    const request = {
      op:'',
      data:{}
    };
    const requestSpy = vi.spyOn(channel, 'request');
    notebook.request(request);
    const expectedRequest = {
      op:'',
      data:{
        noteId: notebookId,
      }
    };
    expect(requestSpy).toHaveBeenCalledExactlyOnceWith(expectedRequest);
  });

  it('Should filter response with different noteId', () => {
    channel = new FakeChannel();
    const notebookState = new ServerNotebookFakeImpl(new IdFakeImpl(notebookId)).notebookState();
    const paragraphCollection = new ParagraphCollectionFake();
    notebook = new NotebookImpl(channel, new WebSocketPayloadImpl(notebookState), paragraphCollection);
    const wrongId  = 'wrongId';
    const message = {
      op:'',
      data:{
        noteId: wrongId
      }
    };
    const responseSpy = vi.spyOn(paragraphCollection, 'response');
    notebook.response(message);
    expect(responseSpy).toHaveBeenCalledTimes(0);
  });

  it('Should respond ParagraphCollection if response has matching noteId', () => {
    channel = new FakeChannel();
    const notebookState = new ServerNotebookFakeImpl(new IdFakeImpl(notebookId)).notebookState();
    const paragraphCollection = new ParagraphCollectionFake();
    notebook = new NotebookImpl(channel, new WebSocketPayloadImpl(notebookState), paragraphCollection);
    const response = {
      op:'',
      data:{
        noteId: notebookId
      }
    };
    const responseSpy = vi.spyOn(paragraphCollection, 'response');
    notebook.response(response);
    expect(responseSpy).toHaveBeenCalledExactlyOnceWith(response);
  });

  it('Should respond ParagraphCollection if response does not have noteId', () => {
    channel = new FakeChannel();
    const notebookState = new ServerNotebookFakeImpl(new IdFakeImpl(notebookId)).notebookState();
    const paragraphCollection = new ParagraphCollectionFake();
    notebook = new NotebookImpl(channel, new WebSocketPayloadImpl(notebookState), paragraphCollection);
    const response = {
      op:'',
      data:{}
    };
    const responseSpy = vi.spyOn(paragraphCollection, 'response');
    notebook.response(response);
    expect(responseSpy).toHaveBeenCalledExactlyOnceWith(response);
  });
});
