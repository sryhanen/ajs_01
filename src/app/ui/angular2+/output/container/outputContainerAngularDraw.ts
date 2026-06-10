import {OutputContainer} from '../../../../objects/output/container/outputContainer';
import {AngularDraw} from '../../angularDraw/angularDraw';
import {OutputSwitcher} from '../../../../objects/output/switcher/outputSwitcher';
import {OutputFormat} from '../../../../objects/output/format/outputFormat';
import {InterpreterErrorListener} from '../../../../objects/interpreterErrorListener/interpreterErrorListener';
import {OutputPlugin} from '../../../../objects/output/plugins/outputPlugin';

export interface OutputContainerAngularDraw extends Partial<OutputContainer>, AngularDraw{
  outputSwitcher(): OutputSwitcher;
  outputFormats(): OutputFormat[];
  errorListener(): InterpreterErrorListener;
  outputPlugin(): OutputPlugin;
}
