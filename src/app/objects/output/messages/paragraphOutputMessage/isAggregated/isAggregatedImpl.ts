import {IsAggregated} from './isAggregated';

export class IsAggregatedImpl implements IsAggregated {
  private readonly _isAggregated:boolean;

  constructor(isAggregated:boolean) {
    this._isAggregated = isAggregated;
  }

  isAggregated(): boolean {
    return this._isAggregated;
  }

  isStub(): boolean {
    return false;
  }
}
