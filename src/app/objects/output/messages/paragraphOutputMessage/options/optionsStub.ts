import {Options} from './options';

export class OptionsStub implements Options {
  options(): object {
    throw new Error('OptionsStub: Method not be implemented.');
  }

  isStub(): boolean {
    return true;
  }
}
