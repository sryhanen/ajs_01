import {OutputDTO} from '../../output/outputDTO';

export interface ParagraphDTO {
  id:string;
  text: string;
  config:object;
  params:object;
  output?: OutputDTO<unknown>,
}

export const ParagraphDTOStub: ParagraphDTO = {
  get id(): string {
    throw new Error('ParagraphDTOStub: Method not implemented.');
  },
  get text(): string {
    throw new Error('ParagraphDTOStub: Method not implemented.');
  },
  get config(): object {
    throw new Error('ParagraphDTOStub: Method not implemented.');
  },
  get params(): object {
    throw new Error('ParagraphDTOStub: Method not implemented.');
  },
};
