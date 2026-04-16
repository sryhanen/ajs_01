import {ParagraphMessage} from './paragraphMessage';
import {MessageDTO} from '../messageDTO';
import {ParagraphOutputDTO} from '../paragraphOutputMessage/paragraphOutputDTO';
import {ParagraphDTO} from './paragraphDTO';

export class ParagraphMessageImpl implements ParagraphMessage {
  private readonly _data:ParagraphDTO;

  constructor(data:ParagraphDTO) {
    this._data = data;
  }

  id():string {
    return this._data.id;
  }

  toParagraphData(): ParagraphDTO {
    return this._data;
  }

  printAsParagraphOutputMessage(): MessageDTO<ParagraphOutputDTO> {
    return {
      op:'PARAGRAPH_OUTPUT',
      data: {
        noteId:'',
        paragraphId: this._data.id,
        output: this._data.output,
      }
    };
  }
}
