import {Options} from './options';

export class OptionsImpl implements Options {
  private readonly _options:object;

  constructor(options:object) {
    this._options = options;
  }

  options(): object {
    return this._options;
  }

  isStub(): boolean {
    return false;
  }
}
