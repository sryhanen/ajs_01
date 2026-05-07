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
describe('ParagraphCollection', () => {
  //let channel:Channel;
  //let angularObjectCollection: AngularObjectCollection;
  //let paragraphCollection: ParagraphCollection;
  //const paragraphId = 'paragraphId';
  //const paragraphText = 'some text';
  //const paragraphConfig = {configProp: 'configProp'};
  //const paragraphParams = {paramProp: 'paramProp'};
  //const paragraphDTO: ParagraphDTO = {
  //  id: paragraphId,
  //  text: paragraphText,
  //  config: paragraphConfig,
  //  params: paragraphParams
  //};
  //let paragraphs: Paragraph[];

  beforeEach(() => {
    //channel = new FakeChannel();
    //angularObjectCollection = new AngularObjectCollectionImpl(channel);
    //paragraphs = [
    //  new ParagraphImpl(channel, paragraphDTO, angularObjectCollection)
    //];
  });

  describe('Birth', () => {
    it('Should be initialized', () => {
      //paragraphCollection = new ParagraphCollectionImpl(channel, paragraphs, angularObjectCollection);
      //expect(paragraphCollection).toBeInstanceOf(ParagraphCollectionImpl);
    });
  });

  describe('Request', () => {
    beforeEach(() => {
      //paragraphCollection = new ParagraphCollectionImpl(channel, paragraphs, angularObjectCollection);
    });

    it('Should decorate run paragraph requests', () => {
      //const runParagraphRequest: MessageDTO<RunParagraphDTO> = {
      //  op:'RUN_PARAGRAPH',
      //  data: {
      //    id: paragraphId,
      //    paragraph: '',
      //    config: {},
      //    params: {}
      //  }
      //};
      //const expectedRequest: MessageDTO<RunParagraphDTO> = {
      //  op:'RUN_PARAGRAPH',
      //  data: {
      //    id: paragraphId,
      //    paragraph: paragraphText,
      //    config: paragraphConfig,
      //    params: paragraphParams
      //  }
      //};
      //const spy = vi.spyOn(channel, 'request');
      //paragraphCollection.request(runParagraphRequest);
      //expect(spy).toHaveBeenCalledExactlyOnceWith(expectedRequest);
    });

    it('Should request channel', () => {
      //const request: MessageDTO<object> = {
      //  op:'Default',
      //  data:{
      //    test:'test'
      //  }
      //};
      //const spy = vi.spyOn(channel, 'request');
      //paragraphCollection.request(request);
      //expect(spy).toHaveBeenCalledExactlyOnceWith(request);
    });
  });

  describe('Response', () => {
    //let pushParagraphs:PushValue<Paragraph[]>;
    beforeEach(() => {
      //paragraphCollection = new ParagraphCollectionImpl(channel, paragraphs, angularObjectCollection);
      //pushParagraphs = new PushValueImpl();
      //paragraphCollection.paragraphs(pushParagraphs);
    });

    it('Should update paragraph', () => {
      //const paragraphMessage:MessageDTO<ParagraphDTO> = {
      //  op: 'PARAGRAPH',
      //  data: {
      //    id: paragraphId,
      //    text: '',
      //    config: {},
      //    params: {}
      //  },
      //};
      //expect(pushParagraphs.value()).toHaveLength(1);
      //const previousInstance = pushParagraphs.value()[0].print();
      //paragraphCollection.response(paragraphMessage);
      //expect(pushParagraphs.value()).toHaveLength(1);
      //const newInstance = pushParagraphs.value()[0].print();
      //expect(previousInstance.id).toEqual(newInstance.id);
      //expect(previousInstance.text).not.toEqual(newInstance.text);
    });

    it('Should add paragraph', () => {
      //const paragraphAddedMessage:MessageDTO<ParagraphAddedDTO> = {
      //  op: 'PARAGRAPH_ADDED',
      //  data: {
      //    index:0,
      //    paragraph: {
      //      id: '',
      //      text: '',
      //      config: {},
      //      params: {}
      //    }
      //  },
      //};
      //expect(pushParagraphs.value()).toHaveLength(1);
      //paragraphCollection.response(paragraphAddedMessage);
      //expect(pushParagraphs.value()).toHaveLength(2);
    });

    it('Should remove paragraph', () => {
      //const paragraphRemovedMessage:MessageDTO<ParagraphRemovedMessageDTO> = {
      //  op: 'PARAGRAPH_REMOVED',
      //  data: {
      //    id:paragraphId
      //  }
      //};
      //expect(pushParagraphs.value()).toHaveLength(1);
      //paragraphCollection.response(paragraphRemovedMessage);
      //expect(pushParagraphs.value()).toHaveLength(0);
    });

    it('Should respond paragraphs', () => {
      //const response:MessageDTO<object> = {
      //  op:'Default',
      //  data: {}
      //};
      //const spies = paragraphs.map(paragraph => vi.spyOn(paragraph, 'response'));
      //expect(spies).toHaveLength(1);
      //paragraphCollection.response(response);
      //expect(spies[0]).toHaveBeenCalledExactlyOnceWith(response);
    });
  });
});
