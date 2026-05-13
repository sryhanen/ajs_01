import {WritableSignal} from '@angular/core';
import {PushValue} from '../../objects/pushValue/pushValue';

export class WritableSignalAsPushValue<T> implements PushValue<T> {
  private readonly _writableSignal: WritableSignal<T>;

  constructor(writableSignal: WritableSignal<T>) {
    this._writableSignal = writableSignal;
  }

  update(value: T): void {
    this._writableSignal.set(value);
  }

  value(): T {
    return this._writableSignal();
  }
}
