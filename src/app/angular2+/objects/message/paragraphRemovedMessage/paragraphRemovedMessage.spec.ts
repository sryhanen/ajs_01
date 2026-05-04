import {ParagraphRemovedMessage} from './paragraphRemovedMessage';
import {ParagraphRemovedMessageImpl} from './paragraphRemovedMessageImpl';
import {ParagraphRemovedMessageDTO} from './paragraphRemovedMessageDTO';
import {SafeJsonImpl} from '../../safeJson/safeJsonImpl';

describe('ParagraphRemovedMessage', () => {
  const paragraphId = 'paragraphId';
  const data:ParagraphRemovedMessageDTO = {
    id: paragraphId
  };
  const paragraphRemovedMessage: ParagraphRemovedMessage = new ParagraphRemovedMessageImpl(new SafeJsonImpl(data));

  describe('Birth', () => {
    it('Should be initialized', () => {
      expect(paragraphRemovedMessage).toBeInstanceOf(ParagraphRemovedMessageImpl);
    });

    it('Should have id', () => {
      expect(paragraphRemovedMessage.id()).toEqual(paragraphId);
    });
  });
});
