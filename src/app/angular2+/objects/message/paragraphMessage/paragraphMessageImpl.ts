import {ParagraphMessage} from './paragraphMessage';
import {MessageDTO} from '../messageDTO';
import {ParagraphOutputDTO} from '../paragraphOutputMessage/paragraphOutputDTO';
import {ParagraphDTO, ParagraphDTOStub} from './paragraphDTO';
import {SafeJson} from '../../safeJson/safeJson';

export class ParagraphMessageImpl implements ParagraphMessage {
  private readonly _safeJson:SafeJson<ParagraphDTO>;

  constructor(safeJson:SafeJson<ParagraphDTO>) {
    this._safeJson = safeJson;
  }

  toParagraphDTO(): ParagraphDTO {
    return this._safeJson.deserialized(ParagraphDTOStub);
  }

  printAsParagraphOutputMessage(): MessageDTO<ParagraphOutputDTO> {
    const paragraphDTO = this._safeJson.deserialized(ParagraphDTOStub);
    return {
      op:'PARAGRAPH_OUTPUT',
      data: {
        noteId:'',
        paragraphId: paragraphDTO.id,
        output: paragraphDTO.output,
      }
    };
  }
}
