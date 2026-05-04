import {SafeJsonImpl} from '../../safeJson/safeJsonImpl';
import {ParagraphAddedMessage} from './paragraphAddedMessage';
import {ParagraphAddedMessageImpl} from './paragraphAddedMessageImpl';
import {ParagraphAddedDTO} from './paragraphAddedMessageDTO';
import {ParagraphDTO} from '../paragraphMessage/paragraphDTO';
import {FakeChannel} from '../../channel/fakeChannel';
import {AngularObjectCollectionImpl} from '../../angularObjectCollection/angularObjectCollectionImpl';
import {Channel} from '../../channel/channel';
import {ParagraphImpl} from '../../paragraph/paragraphImpl';

describe('ParagraphAddedMessage', () => {
  const paragraph:ParagraphDTO = {
    id: '',
    config: undefined, params: undefined,
    text: ''
  };
  const index = 1;
  const data: ParagraphAddedDTO = {
    paragraph:paragraph,
    index: index
  };
  const channel:Channel = new FakeChannel();
  const paragraphAddedMessage:ParagraphAddedMessage = new ParagraphAddedMessageImpl(new SafeJsonImpl(data));

  describe('Birth', () => {
    it('Should be initialized', () => {
      expect(paragraphAddedMessage).toBeInstanceOf(ParagraphAddedMessageImpl);
    });

    it('Should have paragraph', () => {
      expect(paragraphAddedMessage.paragraph(channel, new AngularObjectCollectionImpl(channel))).toBeInstanceOf(ParagraphImpl);
    });

    it('Should have index', () => {
      expect(paragraphAddedMessage.index()).toEqual(index);
    });
  });
});
