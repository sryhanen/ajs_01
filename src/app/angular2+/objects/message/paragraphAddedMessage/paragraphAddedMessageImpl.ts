import {ParagraphAddedMessage} from './paragraphAddedMessage';
import {AngularObjectCollection} from '../../angularObjectCollection/angularObjectCollection';
import {Channel} from '../../channel/channel';
import {Paragraph} from '../../paragraph/paragraph';
import {SafeJson} from '../../safeJson/safeJson';
import {ParagraphAddedDTO, ParagraphAddedDTOStub} from './paragraphAddedMessageDTO';
import {ParagraphImpl} from '../../paragraph/paragraphImpl';

export class ParagraphAddedMessageImpl implements ParagraphAddedMessage {
  private readonly _safeJson: SafeJson<ParagraphAddedDTO>;

  constructor(safeJson: SafeJson<ParagraphAddedDTO>) {
    this._safeJson = safeJson;
  }

  paragraph(channel: Channel, angularObjectCollection: AngularObjectCollection): Paragraph {
    const paragraphData = this._safeJson.deserialized(ParagraphAddedDTOStub).paragraph;
    return new ParagraphImpl(channel, paragraphData, angularObjectCollection);
  }

  index(): number {
    return this._safeJson.deserialized(ParagraphAddedDTOStub).index;
  }
}
