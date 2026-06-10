import {Channel} from '../../../../channel/channel';
import {OutputPlugin} from '../../../plugins/outputPlugin';

export interface ParagraphOutputResponse extends Channel{
  outputPlugin(): OutputPlugin;
}
