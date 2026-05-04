import {ParagraphRemovedMessage} from './paragraphRemovedMessage';
import {SafeJson} from '../../safeJson/safeJson';
import {ParagraphRemovedMessageDTO, ParagraphRemovedMessageDTOStub} from './paragraphRemovedMessageDTO';

export class ParagraphRemovedMessageImpl implements ParagraphRemovedMessage {
  private readonly _safeJson: SafeJson<ParagraphRemovedMessageDTO>;

  constructor(safeJson:SafeJson<ParagraphRemovedMessageDTO>) {
    this._safeJson = safeJson;
  }

  id():string {
    return this._safeJson.deserialized(ParagraphRemovedMessageDTOStub).id;
  }
}
