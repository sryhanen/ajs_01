import {Respondable} from '../../../objects/channel/respondable';
import {WebSocketResponseImpl} from '../../../objects/webSocket/response/webSocketResponseImpl';
import {WebSocketPayloadImpl} from '../../../objects/webSocket/webSocketPayload/webSocketPayloadImpl';
import {Output} from './output';
import {OutputPayload} from './outputPayload';

export class OutputResponse implements Respondable {
  private readonly _output:Output;

  constructor(output:Output) {
    this._output = output;
  }

  response(json:object):void {
    const webSocketResponse = new WebSocketResponseImpl(new WebSocketPayloadImpl(json));
    if(webSocketResponse.operation() === 'PARAGRAPH_OUTPUT'){
      const outputPayload = webSocketResponse.dataAsWebSocketPayload().objectProperty('output') as OutputPayload;
      this._output.render(outputPayload);
    }
  }
}
