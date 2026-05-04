import {ParagraphDTO} from '../paragraphMessage/paragraphDTO';

export interface ParagraphAddedDTO {
  paragraph:ParagraphDTO;
  index:number;
}

export const ParagraphAddedDTOStub: ParagraphAddedDTO = {
  get paragraph(): ParagraphDTO {
    throw new Error('ParagraphAddedDTOStub: Property not defined');
  },
  get index(): number {
    throw new Error('ParagraphAddedDTOStub: Property not defined');
  },
};
