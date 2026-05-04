import {Channel} from '../channel/channel';
import {AngularObjectCollection} from '../angularObjectCollection/angularObjectCollection';
import {ParagraphCollection} from './paragraphCollection';
import {FakeChannel} from '../channel/fakeChannel';
import {AngularObjectCollectionImpl} from '../angularObjectCollection/angularObjectCollectionImpl';
import {ParagraphCollectionImpl} from './paragraphCollectionImpl';
import {Paragraph} from '../paragraph/paragraph';
import {ParagraphImpl} from '../paragraph/paragraphImpl';
import {ParagraphDTO} from '../message/paragraphMessage/paragraphDTO';
import {RunParagraphDTO} from '../message/runParagraphMessage/runParagraphDTO';
import {MessageDTO} from '../message/messageDTO';
import {PushValueImpl} from '../pushValue/pushValueImpl';
import {PushValue} from '../pushValue/pushValue';
import {ParagraphAddedDTO} from '../message/paragraphAddedMessage/paragraphAddedMessageDTO';
import {ParagraphRemovedMessageDTO} from "../message/paragraphRemovedMessage/paragraphRemovedMessageDTO";

describe('ParagraphCollection', () => {
  let channel:Channel;
  let angularObjectCollection: AngularObjectCollection;
  let paragraphCollection: ParagraphCollection;
  const paragraphId = 'paragraphId';
  const paragraphText = 'some text';
  const paragraphConfig = {configProp: 'configProp'};
  const paragraphParams = {paramProp: 'paramProp'};
  const paragraphDTO: ParagraphDTO = {
    id: paragraphId,
    text: paragraphText,
    config: paragraphConfig,
    params: paragraphParams
  };
  let paragraphs: Paragraph[];

  beforeEach(() => {
    channel = new FakeChannel();
    angularObjectCollection = new AngularObjectCollectionImpl(channel);
    paragraphs = [
      new ParagraphImpl(channel, paragraphDTO, angularObjectCollection)
    ];
  });

  describe('Birth', () => {
    it('Should be initialized', () => {
      paragraphCollection = new ParagraphCollectionImpl(channel, paragraphs, angularObjectCollection);
      expect(paragraphCollection).toBeInstanceOf(ParagraphCollectionImpl);
    });
  });

  describe('Request', () => {
    beforeEach(() => {
      paragraphCollection = new ParagraphCollectionImpl(channel, paragraphs, angularObjectCollection);
    });

    it('Should decorate run paragraph requests', () => {
      const runParagraphRequest: MessageDTO<RunParagraphDTO> = {
        op:'RUN_PARAGRAPH',
        data: {
          id: paragraphId,
          paragraph: '',
          config: {},
          params: {}
        }
      };
      const expectedRequest: MessageDTO<RunParagraphDTO> = {
        op:'RUN_PARAGRAPH',
        data: {
          id: paragraphId,
          paragraph: paragraphText,
          config: paragraphConfig,
          params: paragraphParams
        }
      };
      const spy = vi.spyOn(channel, 'request');
      paragraphCollection.request(runParagraphRequest);
      expect(spy).toHaveBeenCalledExactlyOnceWith(expectedRequest);
    });

    it('Should request channel', () => {
      const request: MessageDTO<object> = {
        op:'Default',
        data:{
          test:'test'
        }
      };
      const spy = vi.spyOn(channel, 'request');
      paragraphCollection.request(request);
      expect(spy).toHaveBeenCalledExactlyOnceWith(request);
    });
  });

  describe('Response', () => {
    let pushParagraphs:PushValue<Paragraph[]>;
    beforeEach(() => {
      paragraphCollection = new ParagraphCollectionImpl(channel, paragraphs, angularObjectCollection);
      pushParagraphs = new PushValueImpl();
      paragraphCollection.paragraphs(pushParagraphs);
    });

    it('Should update paragraph', () => {
      const paragraphMessage:MessageDTO<ParagraphDTO> = {
        op: 'PARAGRAPH',
        data: {
          id: paragraphId,
          text: '',
          config: {},
          params: {}
        },
      };
      expect(pushParagraphs.value()).toHaveLength(1);
      const previousInstance = pushParagraphs.value()[0].print();
      paragraphCollection.response(paragraphMessage);
      expect(pushParagraphs.value()).toHaveLength(1);
      const newInstance = pushParagraphs.value()[0].print();
      expect(previousInstance.id).toEqual(newInstance.id);
      expect(previousInstance.text).not.toEqual(newInstance.text);
    });

    it('Should add paragraph', () => {
      const paragraphAddedMessage:MessageDTO<ParagraphAddedDTO> = {
        op: 'PARAGRAPH_ADDED',
        data: {
          index:0,
          paragraph: {
            id: '',
            text: '',
            config: {},
            params: {}
          }
        },
      };
      expect(pushParagraphs.value()).toHaveLength(1);
      paragraphCollection.response(paragraphAddedMessage);
      expect(pushParagraphs.value()).toHaveLength(2);
    });

    it('Should remove paragraph', () => {
      const paragraphRemovedMessage:MessageDTO<ParagraphRemovedMessageDTO> = {
        op: 'PARAGRAPH_REMOVED',
        data: {
          id:paragraphId
        }
      };
      expect(pushParagraphs.value()).toHaveLength(1);
      paragraphCollection.response(paragraphRemovedMessage);
      expect(pushParagraphs.value()).toHaveLength(0);
    });

    it('Should respond paragraphs', () => {
      const response:MessageDTO<object> = {
        op:'Default',
        data: {}
      };
      const spies = paragraphs.map(paragraph => vi.spyOn(paragraph, 'response'));
      expect(spies).toHaveLength(1);
      paragraphCollection.response(response);
      expect(spies[0]).toHaveBeenCalledExactlyOnceWith(response);
    });
  });
});
