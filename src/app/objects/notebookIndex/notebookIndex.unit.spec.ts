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
import {NotebookIndex} from './notebookIndex';
import {NotebookIndexImpl} from './notebookIndexImpl';
import {Requestable} from '../channel/requestable';
import {WebSocketPayload} from '../webSocket/webSocketPayload/webSocketPayload';
import {computed, signal, Signal, WritableSignal} from '@angular/core';
import {Notebook} from '../notebook/notebook';
import {RenderNode} from '../rendering/renderNode/renderNode';
import {ChannelFake} from '../../../test/fakes/client/channel/channelFake';
import {WebSocketPayloadImpl} from '../webSocket/webSocketPayload/webSocketPayloadImpl';
import {NotebookStub} from '../notebook/notebookStub';
import {RenderNodeFake} from '../../../test/fakes/client/renderNode/renderNodeFake';
import {NotebookFake} from '../../../test/fakes/client/notebook/notebookFake';
import {NoteServerResponse} from '../../../test/fakes/server/webSocketResponses/note/noteServerResponse';
import {ServerNotebookFakeImpl} from '../../../test/fakes/server/notebook/serverNotebookFakeImpl';
import {IdFakeImpl} from '../../../test/fakes/server/id/idFakeImpl';
import {response} from 'express';
import {RenderNodeImpl} from '../rendering/renderNode/renderNodeImpl';
import {ComponentRegistryFake} from '../../../test/fakes/client/componentRegistry/componentRegistryFake';
import Stubable from '../../shared/interfaces/stubable';

describe('NotebookIndex', () => {
  let notebookIndex: NotebookIndex;
  let requestable:Requestable;
  let notebookIndexState:WebSocketPayload;
  let notebook:WritableSignal<Notebook>;
  let renderNode:Signal<RenderNode>;

  it('Should validate given notebook', () => {
    const notebookIndexId = 'notebookIndexId';
    requestable = new ChannelFake();
    notebookIndexState = new WebSocketPayloadImpl({id:notebookIndexId});
    const notebookId = 'notebookId';
    notebook = signal(new NotebookFake(notebookId));
    renderNode = signal(new RenderNodeFake());
    expect(() => new NotebookIndexImpl(requestable, notebookIndexState, notebook, renderNode)).toThrow();
  });

  it('Should have id', () => {
    requestable = new ChannelFake();
    const id = 'notebook';
    notebookIndexState = new WebSocketPayloadImpl({id:id});
    notebook = signal(new NotebookFake(id));
    renderNode = signal(new RenderNodeFake());
    notebookIndex = new NotebookIndexImpl(requestable, notebookIndexState, notebook, renderNode);
    expect(notebookIndex.id()).toEqual(id);
  });

  it('Should print', () => {
    requestable = new ChannelFake();
    notebookIndexState = new WebSocketPayloadImpl({});
    notebook = signal(new NotebookStub());
    renderNode = signal(new RenderNodeFake());
    notebookIndex = new NotebookIndexImpl(requestable, notebookIndexState, notebook, renderNode);
    expect(notebookIndex.print()()).toEqual(renderNode());
  });

  it('Should respond notebook', () => {
    requestable = new ChannelFake();
    const id = 'notebook';
    notebookIndexState = new WebSocketPayloadImpl({id:id});
    notebook = signal(new NotebookFake(id));
    renderNode = signal(new RenderNodeFake());
    notebookIndex = new NotebookIndexImpl(requestable, notebookIndexState, notebook, renderNode);
    const response = {
      op:'',
      data:{}
    };
    const notebookSpy = vi.spyOn(notebook(), 'response');
    notebookIndex.response(response);
    expect(notebookSpy).toHaveBeenCalledExactlyOnceWith(response);
  });

  it('Should open notebook', () => {
    const notebookIndexId = 'notebookIndexId';
    requestable = new ChannelFake();
    notebookIndexState = new WebSocketPayloadImpl({id:notebookIndexId});
    notebook = signal(new NotebookStub());
    renderNode = signal(new RenderNodeFake());
    notebookIndex = new NotebookIndexImpl(requestable, notebookIndexState, notebook, renderNode);
    const openedNotebook = new NotebookFake(notebookIndexId);
    notebookIndex.openNotebook(openedNotebook);
    const response = {
      op:'',
      data:{}
    };
    const openedNotebookSpy = vi.spyOn(openedNotebook, 'response');
    notebookIndex.response(response);
    expect(openedNotebookSpy).toHaveBeenCalledExactlyOnceWith(response);
  });

  it('Should validate notebook to open', () => {
    const notebookIndexId = 'notebookIndexId';
    requestable = new ChannelFake();
    notebookIndexState = new WebSocketPayloadImpl({id:notebookIndexId});
    notebook = signal(new NotebookStub());
    renderNode = signal(new RenderNodeFake());
    notebookIndex = new NotebookIndexImpl(requestable, notebookIndexState, notebook, renderNode);
    const notebookId = 'notebookId';
    const openedNotebook = new NotebookFake(notebookId);
    expect(() => notebookIndex.openNotebook(openedNotebook)).toThrow();
  });

  it('Should request requestable', () => {
    requestable = new ChannelFake();
    notebookIndexState = new WebSocketPayloadImpl({});
    notebook = signal(new NotebookStub());
    renderNode = signal(new RenderNodeFake());
    notebookIndex = new NotebookIndexImpl(requestable, notebookIndexState, notebook, renderNode);
    const request = {
      op:'',
      data:{}
    };
    const requestableSpy = vi.spyOn(requestable, 'request');
    notebookIndex.request(request);
    expect(requestableSpy).toHaveBeenCalledExactlyOnceWith(request);
  });

  it('Should open notebook on NOTE server response', () => {
    requestable = new ChannelFake();
    const notebookIndexId = 'notebookIndexId';
    notebookIndexState = new WebSocketPayloadImpl({id:notebookIndexId});
    notebook = signal(new NotebookStub());
    renderNode = signal(new RenderNodeImpl(ComponentRegistryFake.FAKE_COMPONENT, computed(() => ({
      notebookIsStub:notebook().isStub()
    }))));
    notebookIndex = new NotebookIndexImpl(requestable, notebookIndexState, notebook, renderNode);
    const noteServerResponse = new NoteServerResponse(new ServerNotebookFakeImpl(new IdFakeImpl(notebookIndexId)).notebookState());
    const notebookIsStubBeforeResponse = notebookIndex.print()().inputs()()['notebookIsStub'];
    notebookIndex.response(noteServerResponse.toObject());
    const notebookIsStubAfterResponse = notebookIndex.print()().inputs()()['notebookIsStub'];
    expect(notebookIsStubBeforeResponse).toBe(true);
    expect(notebookIsStubAfterResponse).toBe(false);
  });
});
