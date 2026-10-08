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
import {FakeChannel} from '../../../test/fakes/channel/fakeChannel';
import {Channel} from '../channel/channel';
import {ParagraphPayloadFactoryImpl} from '../../../test/fakes/paragraph/paragraphPayloadFactoryImpl';
import {ParagraphImpl} from '../paragraph/paragraphImpl';
import {ParagraphServerResponse} from '../../../test/fakes/webSocketServerResponses/paragraph/paragraphServerResponse';
import {
  ParagraphAddedServerResponse
} from '../../../test/fakes/webSocketServerResponses/paragraphAdded/paragraphAddedServerResponse';
import {
  ParagraphRemovedServerResponse
} from '../../../test/fakes/webSocketServerResponses/paragraphRemoved/paragraphRemovedServerResponse';

describe('ParagraphCollection unit test', () => {
  let channel: Channel;
  let paragraphCollection: ParagraphCollection;
  beforeEach(() => {
    channel = new FakeChannel();
    paragraphCollection = new ParagraphCollectionImpl(channel, []);
  });

  it('Should print', () => {
    const paragraphCollectionPrinted = paragraphCollection.print()();
    expect(paragraphCollectionPrinted.isStub()).toBe(false);
    expect(paragraphCollectionPrinted.inputs()()['paragraphs']).toEqual([]);
  });

  it('Should request channel', () => {
    const channelSpy = vi.spyOn(channel, 'request');
    const request = {
      op:'test',
      data:{}
    };
    paragraphCollection.request(request);
    expect(channelSpy).toHaveBeenCalledExactlyOnceWith(request);
  });

  it('Should delegate EXECUTE_PARAGRAPH request', () => {
    const paragraphId = 'para1';
    const paragraphText = 'paragraph text';
    const paragraphPayload = new ParagraphPayloadFactoryImpl({id:paragraphId}).withText(paragraphText).toPayload();
    paragraphCollection = new ParagraphCollectionImpl(channel, [paragraphPayload]);
    const executeParagraphRequest = {
      op:'EXECUTE_PARAGRAPH',
      data:{
        paragraphId:paragraphId,
      }
    };
    const spy = vi.spyOn(channel, 'request');
    paragraphCollection.request(executeParagraphRequest);
    const expectedRequest = {
      op:'RUN_PARAGRAPH',
      data:{
        id:paragraphId,
        paragraph:paragraphText,
        config:paragraphPayload.config,
        params:paragraphPayload.settings.params
      }
    };
    expect(spy).toHaveBeenCalledExactlyOnceWith(expectedRequest);
  });

  describe('AddParagraph', () => {
    const newParagraph = new ParagraphImpl(channel, new ParagraphPayloadFactoryImpl().toPayload());
    it('Should add paragraph', () => {
      const index = 0;
      const paragraphCollectionPrinted = paragraphCollection.print()();
      expect(paragraphCollectionPrinted.inputs()()['paragraphs']).toEqual([]);
      paragraphCollection.addParagraph(newParagraph, index);
      expect(paragraphCollectionPrinted.inputs()()['paragraphs']).toHaveLength(1);
    });

    it('Should not add paragraph with same id', () => {
      const index = 0;
      paragraphCollection.addParagraph(newParagraph, index);
      expect(() => paragraphCollection.addParagraph(newParagraph, index)).toThrow();
    });

    it('Should not add paragraph if index is invalid', () => {
      const negativeIndex = -1;
      const outOfBoundsIndex = 1;
      expect(() => paragraphCollection.addParagraph(newParagraph, negativeIndex)).toThrow();
      expect(() => paragraphCollection.addParagraph(newParagraph, outOfBoundsIndex)).toThrow();
    });
  });

  describe('RemoveParagraph', () => {
    const paragraph = new ParagraphImpl(channel, new ParagraphPayloadFactoryImpl().toPayload());
    it('Should remove paragraph', () => {
      paragraphCollection.addParagraph(paragraph, 0);
      const paragraphCollectionPrinted = paragraphCollection.print()();
      const paragraphsBeforeRemove = paragraphCollectionPrinted.inputs()()['paragraphs'];
      paragraphCollection.removeParagraph(paragraph.id());
      const paragraphsAfterRemove = paragraphCollectionPrinted.inputs()()['paragraphs'];
      expect(paragraphsBeforeRemove).toHaveLength(1);
      expect(paragraphsAfterRemove).toEqual([]);
    });

    it('Should not remove paragraph if it is not in the collection', () => {
      expect(() => paragraphCollection.removeParagraph(paragraph.id())).toThrow();
    });
  });

  describe('UpdateParagraph', () => {
    const paragraph = new ParagraphImpl(channel, new ParagraphPayloadFactoryImpl().toPayload());
    it('Should update paragraph', () => {
      paragraphCollection.addParagraph(paragraph, 0);

      // No better way to test the update at this stage
      // Refactor the test when state change can be asserted
      const paragraphCollectionPrinted = paragraphCollection.print()();
      const paragraphsBeforeUpdate = paragraphCollectionPrinted.inputs()()['paragraphs'];
      paragraphCollection.updateParagraph(paragraph);
      const paragraphsAfterUpdate = paragraphCollectionPrinted.inputs()()['paragraphs'];
      expect(paragraphsBeforeUpdate).toHaveLength(1);
      expect(paragraphsAfterUpdate).toHaveLength(1);
    });

    it('Should not update paragraph if it is not in the collection', () => {
      expect(() => paragraphCollection.updateParagraph(paragraph)).toThrow();
    });
  });

  it('PARAGRAPH response should update paragraph', () => {
    const paragraphPayloadFactory =  new ParagraphPayloadFactoryImpl();
    paragraphCollection = new ParagraphCollectionImpl(channel, [paragraphPayloadFactory.toPayload()]);
    const paragraphResponse = new ParagraphServerResponse(paragraphPayloadFactory);
    // No better way to test the update at this stage
    // Refactor the test when state change can be asserted
    const paragraphCollectionPrinted = paragraphCollection.print()();
    const paragraphsBeforeResponse = paragraphCollectionPrinted.inputs()()['paragraphs'];
    paragraphCollection.response(paragraphResponse.toObject());
    const paragraphsAfterResponse = paragraphCollectionPrinted.inputs()()['paragraphs'];
    expect(paragraphsBeforeResponse).toHaveLength(1);
    expect(paragraphsAfterResponse).toHaveLength(1);
  });

  it('PARAGRAPH_ADDED response should add paragraph', () => {
    const paragraphPayloadFactory =  new ParagraphPayloadFactoryImpl();
    const index = 0;
    const paragraphAddedResponse = new ParagraphAddedServerResponse(paragraphPayloadFactory, index);
    const paragraphCollectionPrinted = paragraphCollection.print()();
    const paragraphsBeforeResponse = paragraphCollectionPrinted.inputs()()['paragraphs'];
    paragraphCollection.response(paragraphAddedResponse.toObject());
    const paragraphsAfterResponse = paragraphCollectionPrinted.inputs()()['paragraphs'];
    expect(paragraphsBeforeResponse).toEqual([]);
    expect(paragraphsAfterResponse).toHaveLength(1);
  });

  it('PARAGRAPH_REMOVED response should remove paragraph', () => {
    const paragraphPayloadFactory =  new ParagraphPayloadFactoryImpl();
    paragraphCollection = new ParagraphCollectionImpl(channel, [paragraphPayloadFactory.toPayload()]);
    const paragraphRemovedResponse = new ParagraphRemovedServerResponse(paragraphPayloadFactory.toPayload().id);
    const paragraphCollectionPrinted = paragraphCollection.print()();
    const paragraphsBeforeResponse = paragraphCollectionPrinted.inputs()()['paragraphs'];
    paragraphCollection.response(paragraphRemovedResponse.toObject());
    const paragraphsAfterResponse = paragraphCollectionPrinted.inputs()()['paragraphs'];
    expect(paragraphsBeforeResponse).toHaveLength(1);
    expect(paragraphsAfterResponse).toEqual([]);
  });

  it('Should respond paragraphs', () => {
    const paragraph1 = new ParagraphImpl(paragraphCollection, new ParagraphPayloadFactoryImpl().toPayload());
    const paragraph2 = new ParagraphImpl(paragraphCollection, new ParagraphPayloadFactoryImpl().toPayload());
    const index = 0;
    paragraphCollection.addParagraph(paragraph1,index);
    paragraphCollection.addParagraph(paragraph2, index);
    const paragraph1Spy = vi.spyOn(paragraph1, 'response');
    const paragraph2Spy = vi.spyOn(paragraph2, 'response');
    const response = {
      op:'test',
      data:{}
    };
    paragraphCollection.response(response);
    expect(paragraph1Spy).toHaveBeenCalledExactlyOnceWith(response);
    expect(paragraph2Spy).toHaveBeenCalledExactlyOnceWith(response);
  });
});
