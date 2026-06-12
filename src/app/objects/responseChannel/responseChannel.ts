import {Response} from '../channel/response';

export interface ResponseChannel extends Response {
  subscribe(operation:string, eventHandler:(json:object) => void):void;
}
