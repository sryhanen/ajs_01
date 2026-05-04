import {AngularObjectCollection} from '../../angularObjectCollection/angularObjectCollection';
import {Paragraph} from '../../paragraph/paragraph';
import {Channel} from '../../channel/channel';

export interface ParagraphAddedMessage {
  paragraph(channel:Channel, angularObjectCollection: AngularObjectCollection):Paragraph;
  index():number;
}
