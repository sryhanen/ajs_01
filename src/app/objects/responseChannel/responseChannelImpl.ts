import {ResponseChannel} from './responseChannel';
import {MessageImpl} from '../message/messageImpl';
import {SafeJsonImpl} from '../safeJson/safeJsonImpl';

export class ResponseChannelImpl implements ResponseChannel {
  private readonly _events: Map<string, (json:object) => void>;

  constructor() {
    this._events = new Map();
  }

  subscribe(operation: string, eventHandler: (json:object) => void) {
    if(this._events.has(operation)) {
      throw new Error(`Event "${operation}" has been already registered.`);
    }
    this._events.set(operation, eventHandler);
  }

  response(data: object): void {
    const message = new MessageImpl(new SafeJsonImpl(data));
    const event = this._events.get(message.operation());
    if(event) {
      event(data);
    }
  }
}
