import {IsAggregated} from './isAggregated';

export class IsAggregatedStub implements IsAggregated {
  isAggregated(): boolean {
    throw new Error('IsAggregatedStub: Method not be implemented.');
  }

  isStub(): boolean {
    return true;
  }
}
