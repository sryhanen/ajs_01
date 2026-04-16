import {OutputDTO} from '../../output/outputDTO';

export interface ParagraphDTO {
  id:string;
  text: string;
  config:object;
  params:object;
  output?: OutputDTO<unknown>,
}
