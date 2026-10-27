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
import {NotebookIndexCollection} from './notebookIndexCollection';
import {ChannelFake} from '../../../test/fakes/client/channel/channelFake';
import {NotebookIndexCollectionImpl} from './notebookIndexCollectionImpl';
import {Requestable} from '../channel/requestable';
import {computed, Signal, signal, WritableSignal} from '@angular/core';
import {RenderNode} from '../rendering/renderNode/renderNode';
import {NotebookIndex} from '../notebookIndex/notebookIndex';
import {NotebookIndexFake} from '../../../test/fakes/client/notebookIndex/notebookIndexFake';
import {RenderNodeImpl} from '../rendering/renderNode/renderNodeImpl';
import {ComponentRegistryFake} from '../../../test/fakes/client/componentRegistry/componentRegistryFake';
import {RenderNodeFake} from '../../../test/fakes/client/renderNode/renderNodeFake';
import {NotesInfoServerResponse} from '../../../test/fakes/server/webSocketResponses/notesInfo/notesInfoServerResponse';

describe('NotebookIndexCollection unit test', () => {
  let requestable: Requestable;
  let notebookIndices: WritableSignal<Map<string, NotebookIndex>>;
  let renderNodeFake:Signal<RenderNode>;
  let notebookIndexCollection: NotebookIndexCollection;


  it('Should add', () => {
    requestable = new ChannelFake();
    notebookIndices = signal(new Map(), {equal:() => false});
    renderNodeFake = signal(new RenderNodeImpl(ComponentRegistryFake.FAKE_COMPONENT, computed(() => ({
      notebookIndicesSize: notebookIndices().size
    }))));
    notebookIndexCollection = new NotebookIndexCollectionImpl(requestable, notebookIndices, renderNodeFake);
    const notebookIndex = new NotebookIndexFake('note1');
    notebookIndexCollection.add(notebookIndex);
    const notebookIndicesSize = notebookIndexCollection.print()().inputs()()['notebookIndicesSize'];
    expect(notebookIndicesSize).toEqual(1);
  });

  it('Should not allow duplicate indices', () => {
    requestable = new ChannelFake();
    notebookIndices = signal(new Map(), {equal:() => false});
    renderNodeFake = signal(new RenderNodeImpl(ComponentRegistryFake.FAKE_COMPONENT, computed(() => ({
      notebookIndicesSize: notebookIndices().size
    }))));
    notebookIndexCollection = new NotebookIndexCollectionImpl(requestable, notebookIndices, renderNodeFake);
    const notebookIndex = new NotebookIndexFake('note1');
    notebookIndexCollection.add(notebookIndex);
    expect(() => notebookIndexCollection.add(notebookIndex)).toThrow();
  });

  it('Should clear', () => {
    requestable = new ChannelFake();
    const fakeIndex = new NotebookIndexFake('note1');
    notebookIndices = signal(new Map([[fakeIndex.id(), fakeIndex]]), {equal:() => false});
    renderNodeFake = signal(new RenderNodeImpl(ComponentRegistryFake.FAKE_COMPONENT, computed(() => ({
      notebookIndicesSize: notebookIndices().size
    }))));
    notebookIndexCollection = new NotebookIndexCollectionImpl(requestable, notebookIndices, renderNodeFake);
    const indicesSizeBeforeClear = notebookIndexCollection.print()().inputs()()['notebookIndicesSize'];
    notebookIndexCollection.clear();
    const indicesSizeAfterClear = notebookIndexCollection.print()().inputs()()['notebookIndicesSize'];
    expect(indicesSizeBeforeClear).toEqual(1);
    expect(indicesSizeAfterClear).toEqual(0);
  });

  it('Should request requestable', () => {
    requestable = new ChannelFake();
    notebookIndices = signal(new Map(), {equal:() => false});
    renderNodeFake = signal(new RenderNodeFake());
    notebookIndexCollection = new NotebookIndexCollectionImpl(requestable, notebookIndices, renderNodeFake);
    const request = {
      op:'',
      data:{}
    };
    const requestSpy = vi.spyOn(requestable, 'request');
    notebookIndexCollection.request(request);
    expect(requestSpy).toHaveBeenCalledExactlyOnceWith(request);
  });

  it('Should respond notebookIndices', () => {
    requestable = new ChannelFake();
    const fakeNotebookIndex1 = new NotebookIndexFake('note1');
    const fakeNotebookIndex2 = new NotebookIndexFake('note2');
    notebookIndices = signal(new Map([
      [fakeNotebookIndex1.id(), fakeNotebookIndex1],
      [fakeNotebookIndex2.id(), fakeNotebookIndex2],
    ]), {equal:() => false});
    renderNodeFake = signal(new RenderNodeFake());
    notebookIndexCollection = new NotebookIndexCollectionImpl(requestable, notebookIndices, renderNodeFake);
    const response = {
      op:'',
      data:{}
    };
    const fakeNotebookIndex1ResponseSpy = vi.spyOn(fakeNotebookIndex1, 'response');
    const fakeNotebookIndex2ResponseSpy = vi.spyOn(fakeNotebookIndex2, 'response');
    notebookIndexCollection.response(response);
    expect(fakeNotebookIndex1ResponseSpy).toHaveBeenCalledExactlyOnceWith(response);
    expect(fakeNotebookIndex2ResponseSpy).toHaveBeenCalledExactlyOnceWith(response);
  });

  it('Should print', () => {
    requestable = new ChannelFake();
    notebookIndices = signal(new Map(), {equal:() => false});
    renderNodeFake = signal(new RenderNodeFake());
    notebookIndexCollection = new NotebookIndexCollectionImpl(requestable, notebookIndices, renderNodeFake);
    expect(notebookIndexCollection.print()()).toEqual(renderNodeFake());
  });

  it('Should add notebookIndices on NOTES_INFO response', () => {
    requestable = new ChannelFake();
    notebookIndices = signal(new Map(), {equal:() => false});
    renderNodeFake = signal(new RenderNodeImpl(ComponentRegistryFake.FAKE_COMPONENT, computed(() => ({
      notebookIndicesSize: notebookIndices().size
    }))));
    notebookIndexCollection = new NotebookIndexCollectionImpl(requestable, notebookIndices, renderNodeFake);
    const notesInfoData = [
      {id: 'note1', isTrash: false, name: 'note1', path: ''},
      {id: 'note2', isTrash: false, name: 'note2', path: ''},
    ];
    const notesInfoServerResponse = new NotesInfoServerResponse(notesInfoData);
    notebookIndexCollection.response(notesInfoServerResponse.toObject());
    const notebookIndicesSize =notebookIndexCollection.print()().inputs()()['notebookIndicesSize'];
    expect(notebookIndicesSize).toEqual(2);
  });
});
