import {OutputSwitcherAngularDraw} from './outputSwitcherAngularDraw';
import {OutputSwitcher} from '../../../../objects/output/switcher/outputSwitcher';

export class OutputSwitcherAngularDrawImpl implements OutputSwitcherAngularDraw {
  private readonly _outputSwitcher: OutputSwitcher;
  private _status:{ isSwitchable: boolean, isLoading: boolean };

  constructor(outputSwitcher: OutputSwitcher) {
    this._outputSwitcher = outputSwitcher;
    this._status = this._outputSwitcher.status();
  }

  draw(): void {
    this._status = this._outputSwitcher.status();
  }

  status(): { isSwitchable: boolean; isLoading: boolean } {
    return this._status;
  }
}
