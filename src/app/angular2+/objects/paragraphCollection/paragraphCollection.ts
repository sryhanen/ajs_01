import {PushValue} from '../pushValue/pushValue';
import {Paragraph} from '../paragraph/paragraph';
import {Channel} from '../channel/channel';

export interface ParagraphCollection extends Channel {
  paragraphs(value:PushValue<Paragraph[]>):void;
}
