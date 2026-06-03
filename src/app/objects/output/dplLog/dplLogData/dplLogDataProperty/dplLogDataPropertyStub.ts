import {DplLogDataProperty} from './dplLogDataProperty';

export class DplLogDataPropertyStub implements DplLogDataProperty {
  isStub(): boolean {
    return true;
  }

  value(): string {
    throw new Error('DplLogDataPropertyStub: Method not implemented.');
  }
}
