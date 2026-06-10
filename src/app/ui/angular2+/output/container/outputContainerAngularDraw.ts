import {OutputContainer} from '../../../../objects/output/container/outputContainer';
import {AngularDraw} from '../../angularDraw/angularDraw';
import {OutputPlugin} from '../../../../objects/output/plugins/outputPlugin';

export interface OutputContainerAngularDraw extends Partial<OutputContainer>, AngularDraw{
  outputPlugin(): OutputPlugin;
}
