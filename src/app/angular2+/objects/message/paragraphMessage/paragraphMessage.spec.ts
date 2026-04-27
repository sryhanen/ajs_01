import {ParagraphDTO} from './paragraphDTO';
import {ParagraphMessage} from './paragraphMessage';
import {ParagraphMessageImpl} from './paragraphMessageImpl';
import {ParagraphOutputDTO} from '../paragraphOutputMessage/paragraphOutputDTO';
import {MessageDTO} from '../messageDTO';

describe('Paragraph Message', () => {
  const paragraphId = 'paragraphId';
  const paragraphConfig = {
    configProperty1: 'config value1'
  };
  const paragraphParams = {
    paramsProperty1: 'params value1'
  };
  const paragraphText = 'paragraph text value';
  let data: ParagraphDTO;
  let paragraphMessage: ParagraphMessage;

  beforeEach(() => {
    data = {
      id: paragraphId,
      config: paragraphConfig,
      params: paragraphParams,
      text: paragraphText
    };
    paragraphMessage = new ParagraphMessageImpl(data);
  });

  describe('Birth', () => {
    it('Should be initialized', () => {
      expect(paragraphMessage).toBeInstanceOf(ParagraphMessageImpl);
    });

    it('Should have id', () => {
      expect(paragraphMessage.id()).toEqual(paragraphId);
    });

    it('Should have paragraphData', () => {
      expect(paragraphMessage.toParagraphData()).toEqual(data);
    });
  });

  describe('Print as paragraph output message', () => {
    it('Should print expected message without output', () => {
      const expectedMessageWithoutOutput: MessageDTO<ParagraphOutputDTO> = {
        op:'PARAGRAPH_OUTPUT',
        data: {
          noteId:'',
          paragraphId: paragraphId,
          output: undefined,
        }
      };
      expect(paragraphMessage.printAsParagraphOutputMessage()).toEqual(expectedMessageWithoutOutput);
    });

    it('Should print expected message with output', () => {
      const output = {
        data: {},
        type: 'test type'
      };
      const expectedMessageWithOutput: MessageDTO<ParagraphOutputDTO> = {
        op:'PARAGRAPH_OUTPUT',
        data: {
          noteId:'',
          paragraphId: paragraphId,
          output: output
        }
      };
      data.output = output;
      paragraphMessage = new ParagraphMessageImpl(data);
      expect(paragraphMessage.printAsParagraphOutputMessage()).toEqual(expectedMessageWithOutput);
    });
  });
});
