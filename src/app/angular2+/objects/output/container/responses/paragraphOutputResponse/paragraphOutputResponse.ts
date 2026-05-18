import {OutputPlugin} from '../../../plugins/outputPlugin';
import {Channel} from '../../../../channel/channel';
import {PushValue} from '../../../../pushValue/pushValue';

export interface ParagraphOutputResponse extends Channel {
  outputPlugin(pushValue: PushValue<OutputPlugin>): void;
}
