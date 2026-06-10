import {OutputContainerAngularDraw} from './outputContainerAngularDraw';
import {OutputSwitcher} from '../../../../objects/output/switcher/outputSwitcher';
import {OutputFormat} from '../../../../objects/output/format/outputFormat';
import {InterpreterErrorListener} from '../../../../objects/interpreterErrorListener/interpreterErrorListener';
import {OutputPlugin} from '../../../../objects/output/plugins/outputPlugin';
import {OutputContainer} from '../../../../objects/output/container/outputContainer';

export class OutputContainerAngularDrawImpl implements OutputContainerAngularDraw {
  private readonly _outputContainer:OutputContainer;
  private _outputPlugin:OutputPlugin;

  constructor(outputContainer:OutputContainer) {
    this._outputContainer = outputContainer;
    this._outputPlugin = this._outputContainer.outputPlugin();
  }

  draw():void {
    this._outputPlugin = this._outputContainer.outputPlugin();
  }

  outputSwitcher(): OutputSwitcher {
    return this._outputContainer.outputSwitcher();
  }

  outputFormats(): OutputFormat[]{
    return this._outputContainer.outputFormats();
  }

  errorListener(): InterpreterErrorListener{
    return this._outputContainer.errorListener();
  }

  outputPlugin(): OutputPlugin{
    return this._outputPlugin;
  }
}
