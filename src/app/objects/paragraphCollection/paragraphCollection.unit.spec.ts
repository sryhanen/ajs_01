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
import {ParagraphCollection} from './paragraphCollection';
import {ParagraphCollectionImpl} from './paragraphCollectionImpl';
import {FakeChannel} from '../channel/fakeChannel';
import {Requestable} from '../channel/requestable';
import {WebSocketPayloadImpl} from '../webSocket/webSocketPayload/webSocketPayloadImpl';
import {ServerNotebookFakeImpl} from '../../../test/fakes/server/notebook/serverNotebookFakeImpl';
import {RenderNode} from '../rendering/renderNode/renderNode';
import {
  ServerNotebookFakeWithParagraphs
} from '../../../test/fakes/server/notebook/withParagraphs/serverNotebookFakeWithParagraphs';
import {ServerParagraphFakeImpl} from '../../../test/fakes/server/paragraph/serverParagraphFakeImpl';
import {IdFakeImpl} from '../../../test/fakes/server/id/idFakeImpl';

describe('ParagraphCollection unit test', () => {
  let requestable: Requestable;
  let paragraphCollection: ParagraphCollection;


  it('Should print RenderNode', () => {
    requestable = new FakeChannel();
    const notebookState = new ServerNotebookFakeImpl().notebookState();
    paragraphCollection = new ParagraphCollectionImpl(requestable, new WebSocketPayloadImpl(notebookState));
    const renderNode:RenderNode = paragraphCollection.print()();
    expect(renderNode.isStub()).toBe(false);
  });

  it('Should print paragraphs', () => {
    requestable = new FakeChannel();
    const notebookState = new ServerNotebookFakeImpl().notebookState();
    paragraphCollection = new ParagraphCollectionImpl(requestable, new WebSocketPayloadImpl(notebookState));
    const paragraphs= paragraphCollection.print()().inputs()()['paragraphs'];
    expect(paragraphs).toBeDefined();
  });

  it('Should request channel', () => {
    requestable = new FakeChannel();
    const notebookState = new ServerNotebookFakeImpl().notebookState();
    paragraphCollection = new ParagraphCollectionImpl(requestable, new WebSocketPayloadImpl(notebookState));
    const requestSpy = vi.spyOn(requestable, 'request');
    const request =  {
      op:'test',
      data: {}
    };
    paragraphCollection.request(request);
    expect(requestSpy).toHaveBeenCalledExactlyOnceWith(request);
  });

  it('Should delegate EXECUTE_PARAGRAPH request', () => {
    requestable = new FakeChannel();
    const paragraphId = 'para1';
    const fakeParagraph = new ServerParagraphFakeImpl(new IdFakeImpl(paragraphId)).paragraphState();
    const paragraphs = [
      fakeParagraph
    ];
    const notebookState = new ServerNotebookFakeWithParagraphs(new ServerNotebookFakeImpl(), paragraphs).notebookState();
    paragraphCollection = new ParagraphCollectionImpl(requestable, new WebSocketPayloadImpl(notebookState));
    const executeParagraphRequest = {
      op:'EXECUTE_PARAGRAPH',
      data:{
        paragraphId:paragraphId,
      }
    };
    const spy = vi.spyOn(requestable, 'request');
    paragraphCollection.request(executeParagraphRequest);
    const expectedRequest = {
      op:'RUN_PARAGRAPH',
      data:{
        id:paragraphId,
        paragraph:fakeParagraph.text,
        config:fakeParagraph.config,
        params:fakeParagraph.settings.params
      }
    };
    expect(spy).toHaveBeenCalledExactlyOnceWith(expectedRequest);
  });

  it('Should add paragraph, "PARAGRAPH_ADDED" response', () => {
    requestable = new FakeChannel();
    const notebookState = new ServerNotebookFakeImpl().notebookState();
    paragraphCollection = new ParagraphCollectionImpl(requestable, new WebSocketPayloadImpl(notebookState));
    const paragraphState  = new ServerParagraphFakeImpl().paragraphState();
    const paragraphAddedResponse = {
      op:'PARAGRAPH_ADDED',
      data:{
        paragraph:paragraphState,
        index:0
      }
    };
    paragraphCollection.response(paragraphAddedResponse);
    expect(paragraphCollection.print()().inputs()()['paragraphs']).toHaveLength(1);
  });

  it('Should add paragraph, "PARAGRAPH" response', () => {
    requestable = new FakeChannel();
    const notebookState = new ServerNotebookFakeImpl().notebookState();
    paragraphCollection = new ParagraphCollectionImpl(requestable, new WebSocketPayloadImpl(notebookState));
    const paragraphState  = new ServerParagraphFakeImpl().paragraphState();
    const paragraphResponse = {
      op:'PARAGRAPH',
      data:paragraphState
    };
    paragraphCollection.response(paragraphResponse);
    expect(paragraphCollection.print()().inputs()()['paragraphs']).toHaveLength(1);
  });

  it('Should not add paragraph if index is negative', () => {
    requestable = new FakeChannel();
    const notebookState = new ServerNotebookFakeImpl().notebookState();
    paragraphCollection = new ParagraphCollectionImpl(requestable, new WebSocketPayloadImpl(notebookState));
    const paragraphState  = new ServerParagraphFakeImpl().paragraphState();
    const paragraphAddedResponse = {
      op:'PARAGRAPH_ADDED',
      data:{
        paragraph:paragraphState,
        index:-1
      }
    };
    expect(() => paragraphCollection.response(paragraphAddedResponse)).toThrow();
  });

  it('Should not add paragraph if index is invalid', () => {
    requestable = new FakeChannel();
    const notebookState = new ServerNotebookFakeImpl().notebookState();
    paragraphCollection = new ParagraphCollectionImpl(requestable, new WebSocketPayloadImpl(notebookState));
    const paragraphState  = new ServerParagraphFakeImpl().paragraphState();
    const paragraphAddedResponse = {
      op:'PARAGRAPH_ADDED',
      data:{
        paragraph:paragraphState,
        index:1
      }
    };
    expect(() => paragraphCollection.response(paragraphAddedResponse)).toThrow();
  });

  it('Should remove paragraph', () => {
    requestable = new FakeChannel();
    const paragraphId = 'para1';
    const fakeParagraph = new ServerParagraphFakeImpl(new IdFakeImpl(paragraphId)).paragraphState();
    const paragraphs = [
      fakeParagraph
    ];
    const notebookState = new ServerNotebookFakeWithParagraphs(new ServerNotebookFakeImpl(), paragraphs).notebookState();
    paragraphCollection = new ParagraphCollectionImpl(requestable, new WebSocketPayloadImpl(notebookState));
    const paragraphRemovedResponse = {
      op:'PARAGRAPH_REMOVED',
      data:{
        id:paragraphId,
      }
    };
    const paragraphsBeforeRemove = paragraphCollection.print()().inputs()()['paragraphs'];
    paragraphCollection.response(paragraphRemovedResponse);
    const paragraphsAfterRemove = paragraphCollection.print()().inputs()()['paragraphs'];
    expect(paragraphsBeforeRemove).toHaveLength(1);
    expect(paragraphsAfterRemove).toHaveLength(0);
  });

  it('Should not remove paragraph', () => {
    requestable = new FakeChannel();
    const paragraphId = 'para1';
    const fakeParagraph = new ServerParagraphFakeImpl(new IdFakeImpl(paragraphId)).paragraphState();
    const paragraphs = [
      fakeParagraph
    ];
    const notebookState = new ServerNotebookFakeWithParagraphs(new ServerNotebookFakeImpl(), paragraphs).notebookState();
    paragraphCollection = new ParagraphCollectionImpl(requestable, new WebSocketPayloadImpl(notebookState));
    const wrongParagraphId = 'wrongParagraphId';
    const paragraphRemovedResponse = {
      op:'PARAGRAPH_REMOVED',
      data:{
        id:wrongParagraphId,
      }
    };
    expect(() => paragraphCollection.response(paragraphRemovedResponse)).toThrow();
  });
});
