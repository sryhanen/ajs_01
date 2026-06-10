import {OutputContainerAngularDraw} from './outputContainerAngularDraw';
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

  outputPlugin(): OutputPlugin{
    return this._outputPlugin;
  }
}
