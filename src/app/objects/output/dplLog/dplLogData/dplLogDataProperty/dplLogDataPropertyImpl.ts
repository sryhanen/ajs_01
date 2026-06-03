import {DplLogDataProperty} from './dplLogDataProperty';

export class DplLogDataPropertyImpl implements DplLogDataProperty {
  private readonly _value:string;

  constructor(value:string) {
    this._value = value;
  }

  isStub(): boolean {
    return false;
  }

  value(): string {
    return this._value;
  }
}
