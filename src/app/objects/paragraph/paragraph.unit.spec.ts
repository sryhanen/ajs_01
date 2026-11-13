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
import {Paragraph} from './paragraph';
import {Requestable} from '../channel/requestable';
import {ServerParagraphFakeImpl} from '../../../test/fakes/server/paragraph/serverParagraphFakeImpl';
import {ParagraphImpl} from './paragraphImpl';
import {FakeChannel} from '../channel/fakeChannel';
import {WebSocketPayloadImpl} from '../webSocket/webSocketPayload/webSocketPayloadImpl';
import {RenderNode} from '../rendering/renderNode/renderNode';
import {IdFakeImpl} from '../../../test/fakes/server/id/idFakeImpl';
import {EditorFake} from '../../../test/fakes/app/paragraph/editor/editorFake';
import {OutputFake} from '../../../test/fakes/app/output/outputFake';
import {DplLogFake} from '../../../test/fakes/app/paragraph/dplLog/dplLogFake';
import {StatusFake} from '../../../test/fakes/app/paragraph/status/statusFake';
import {TimeInfoFake} from '../../../test/fakes/app/paragraph/timeInfo/timeInfoFake';

describe('Paragraph', () => {
  let requestable: Requestable;
  let paragraph: Paragraph;

  it('Should print RenderNode', () => {
    requestable = new FakeChannel();
    const paragraphState = new ServerParagraphFakeImpl().paragraphState();
    paragraph = new ParagraphImpl(requestable, new WebSocketPayloadImpl(paragraphState));
    const renderNode:RenderNode = paragraph.print()();
    expect(renderNode.isStub()).toBe(false);
  });

  it('Should print Editor', () => {
    requestable = new FakeChannel();
    const paragraphState = new ServerParagraphFakeImpl().paragraphState();
    paragraph = new ParagraphImpl(requestable, new WebSocketPayloadImpl(paragraphState));
    const editor = paragraph.print()().inputs()()['editor'];
    expect(editor).toBeDefined();
  });

  it('Should respond Editor', () => {
    requestable = new FakeChannel();
    const paragraphState = new ServerParagraphFakeImpl().paragraphState();
    const editor = new EditorFake();
    paragraph = new ParagraphImpl(requestable, new WebSocketPayloadImpl(paragraphState), editor);
    const response = {
      op:'',
      data:{}
    };
    const responseSpy = vi.spyOn(editor, 'response');
    paragraph.response(response);
    expect(responseSpy).toHaveBeenCalledExactlyOnceWith(response);
  });

  it('Should print ActionBar', () => {
    requestable = new FakeChannel();
    const paragraphState = new ServerParagraphFakeImpl().paragraphState();
    paragraph = new ParagraphImpl(requestable, new WebSocketPayloadImpl(paragraphState));
    const actionBar = paragraph.print()().inputs()()['actionBar'];
    expect(actionBar).toBeDefined();
  });

  it('Should print Output', () => {
    requestable = new FakeChannel();
    const paragraphState = new ServerParagraphFakeImpl().paragraphState();
    paragraph = new ParagraphImpl(requestable, new WebSocketPayloadImpl(paragraphState));
    const output = paragraph.print()().inputs()()['output'];
    expect(output).toBeDefined();
  });

  it('Should respond Output', () => {
    requestable = new FakeChannel();
    const paragraphState = new ServerParagraphFakeImpl().paragraphState();
    const editor = new EditorFake();
    const output = new OutputFake();
    paragraph = new ParagraphImpl(requestable, new WebSocketPayloadImpl(paragraphState), editor, output);
    const response = {
      op:'',
      data:{}
    };
    const responseSpy = vi.spyOn(output, 'response');
    paragraph.response(response);
    expect(responseSpy).toHaveBeenCalledExactlyOnceWith(response);
  });

  it('Should print DplLog', () => {
    requestable = new FakeChannel();
    const paragraphState = new ServerParagraphFakeImpl().paragraphState();
    paragraph = new ParagraphImpl(requestable, new WebSocketPayloadImpl(paragraphState));
    const dplLog = paragraph.print()().inputs()()['dplLog'];
    expect(dplLog).toBeDefined();
  });

  it('Should respond DplLog', () => {
    requestable = new FakeChannel();
    const paragraphState = new ServerParagraphFakeImpl().paragraphState();
    const editor = new EditorFake();
    const output = new OutputFake();
    const dplLog = new DplLogFake();
    paragraph = new ParagraphImpl(requestable, new WebSocketPayloadImpl(paragraphState), editor, output, dplLog);
    const response = {
      op:'',
      data:{}
    };
    const responseSpy = vi.spyOn(dplLog, 'response');
    paragraph.response(response);
    expect(responseSpy).toHaveBeenCalledExactlyOnceWith(response);
  });

  it('Should respond Status', () => {
    requestable = new FakeChannel();
    const paragraphState = new ServerParagraphFakeImpl().paragraphState();
    const editor = new EditorFake();
    const output = new OutputFake();
    const dplLog = new DplLogFake();
    const status = new StatusFake();
    paragraph = new ParagraphImpl(requestable, new WebSocketPayloadImpl(paragraphState), editor, output, dplLog, status);
    const response = {
      op:'',
      data:{}
    };
    const responseSpy = vi.spyOn(status, 'response');
    paragraph.response(response);
    expect(responseSpy).toHaveBeenCalledExactlyOnceWith(response);
  });

  it('Should respond TimeInfo', () => {
    requestable = new FakeChannel();
    const paragraphState = new ServerParagraphFakeImpl().paragraphState();
    const editor = new EditorFake();
    const output = new OutputFake();
    const dplLog = new DplLogFake();
    const status = new StatusFake();
    const timeInfo = new TimeInfoFake();
    paragraph = new ParagraphImpl(requestable, new WebSocketPayloadImpl(paragraphState), editor, output, dplLog, status, timeInfo);
    const response = {
      op:'',
      data:{}
    };
    const responseSpy = vi.spyOn(status, 'response');
    paragraph.response(response);
    expect(responseSpy).toHaveBeenCalledExactlyOnceWith(response);
  });

  it('Should have id', () => {
    const paragraphId = 'paragraphId';
    requestable = new FakeChannel();
    const paragraphState = new ServerParagraphFakeImpl(new IdFakeImpl(paragraphId)).paragraphState();
    paragraph = new ParagraphImpl(requestable, new WebSocketPayloadImpl(paragraphState));
    expect(paragraph.id()).toEqual(paragraphId);
  });

  it('Run should should create expected request', () => {
    const paragraphId = 'paragraphId';
    requestable = new FakeChannel();
    const paragraphState = new ServerParagraphFakeImpl(new IdFakeImpl(paragraphId)).paragraphState();
    paragraph = new ParagraphImpl(requestable, new WebSocketPayloadImpl(paragraphState));
    const expectedRequest = {
      op:'RUN_PARAGRAPH',
      data:{
        id: paragraphId,
        paragraph: paragraphState.text,
        config: paragraphState.config,
        params: paragraphState.settings.params,
      }
    };
    const spy = vi.spyOn(requestable, 'request');
    paragraph.run();
    expect(spy).toHaveBeenCalledExactlyOnceWith(expectedRequest);
  });

  it('Should decorate request with paragraphId', () => {
    const paragraphId = 'paragraphId';
    requestable = new FakeChannel();
    const paragraphState = new ServerParagraphFakeImpl(new IdFakeImpl(paragraphId)).paragraphState();
    paragraph = new ParagraphImpl(requestable, new WebSocketPayloadImpl(paragraphState));
    const request = {
      op:'',
      data:{}
    };
    const spy = vi.spyOn(requestable, 'request');
    paragraph.request(request);
    const expectedRequest = {
      op:'',
      data:{
        paragraphId:paragraphId
      }
    };
    expect(spy).toHaveBeenCalledExactlyOnceWith(expectedRequest);
  });

  it('Should filter response if paragraphId is different', () => {
    const paragraphId = 'paragraphId';
    requestable = new FakeChannel();
    const paragraphState = new ServerParagraphFakeImpl(new IdFakeImpl(paragraphId)).paragraphState();
    const editor = new EditorFake();
    paragraph = new ParagraphImpl(requestable, new WebSocketPayloadImpl(paragraphState), editor);
    const wrongId = 'wrongId';
    const response = {
      op:'',
      data:{
        paragraphId:wrongId,
      }
    };
    const responseSpy = vi.spyOn(editor, 'response');
    paragraph.response(response);
    expect(responseSpy).toHaveBeenCalledTimes(0);
  });

  it('Should filter respond output if paragraphId matches', () => {
    const paragraphId = 'paragraphId';
    requestable = new FakeChannel();
    const paragraphState = new ServerParagraphFakeImpl(new IdFakeImpl(paragraphId)).paragraphState();
    const editor = new EditorFake();
    paragraph = new ParagraphImpl(requestable, new WebSocketPayloadImpl(paragraphState), editor);
    const response = {
      op:'',
      data:{
        paragraphId:paragraphId,
      }
    };
    const responseSpy = vi.spyOn(editor, 'response');
    paragraph.response(response);
    expect(responseSpy).toHaveBeenCalledExactlyOnceWith(response);
  });
});
