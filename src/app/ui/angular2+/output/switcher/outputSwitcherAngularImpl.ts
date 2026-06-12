import {OutputSwitcherAngular} from './outputSwitcherAngular';
import {OutputSwitcher} from '../../../../objects/output/switcher/outputSwitcher';
import { OutputSwitcherButton } from '../../../../objects/output/switcher/button/outputSwitcherButton';
import {signal, WritableSignal} from '@angular/core';

export class OutputSwitcherAngularImpl implements OutputSwitcherAngular {
  private readonly _outputSwitcher: OutputSwitcher;
  private readonly _status: WritableSignal<{isSwitchable: boolean, isLoading: boolean}>;

  constructor(outputSwitcher: OutputSwitcher) {
    this._outputSwitcher = outputSwitcher;
    this._status = signal(this._outputSwitcher.status());
  }

  outputTypeIsValid(outputType: string): boolean {
     return this._outputSwitcher.outputTypeIsValid(outputType);
  }

  activeButton(): OutputSwitcherButton {
    return this._outputSwitcher.activeButton();
  }

  requestFormatSwitch(outputSwitcherButton: OutputSwitcherButton): void {
    this._outputSwitcher.requestFormatSwitch(outputSwitcherButton);
  }

  response(data: object): void {
    this._status.set(this._outputSwitcher.status());
  }

  status(): { isSwitchable: boolean; isLoading: boolean } {
    return this._status();
  }
}
