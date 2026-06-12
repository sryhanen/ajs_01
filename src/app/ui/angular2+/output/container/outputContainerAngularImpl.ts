import {OutputPlugin} from '../../../../objects/output/plugins/outputPlugin';
import {OutputContainer} from '../../../../objects/output/container/outputContainer';
import { InterpreterErrorListener } from '../../../../objects/interpreterErrorListener/interpreterErrorListener';
import { OutputFormat } from '../../../../objects/output/format/outputFormat';
import { OutputSwitcher } from '../../../../objects/output/switcher/outputSwitcher';
import {signal, WritableSignal} from '@angular/core';
import {OutputSwitcherAngular} from '../switcher/outputSwitcherAngular';
import {OutputSwitcherAngularImpl} from '../switcher/outputSwitcherAngularImpl';

export class OutputContainerAngularImpl implements OutputContainer {
  private readonly _outputContainer: OutputContainer;
  private readonly _outputPlugin: WritableSignal<OutputPlugin>;
  private readonly _outputSwitcher: OutputSwitcherAngular;

  constructor(outputContainer: OutputContainer) {
    this._outputContainer = outputContainer;
    this._outputPlugin = signal(this._outputContainer.outputPlugin());
    this._outputSwitcher = new OutputSwitcherAngularImpl(this._outputContainer.outputSwitcher());
  }

  outputSwitcher(): OutputSwitcher {
    return this._outputSwitcher;
  }

  outputFormats(): OutputFormat[] {
    return this._outputContainer.outputFormats();
  }

  errorListener(): InterpreterErrorListener {
    return this._outputContainer.errorListener();
  }

  request(data: object): void {
    this._outputContainer.request(data);
  }

  response(data: object): void {
    this._outputPlugin.set(this._outputContainer.outputPlugin());
    this._outputSwitcher.response(data);
  }

  outputPlugin(): OutputPlugin{
    return this._outputPlugin();
  }
}
