import {Channel} from '../../channel/channel';
import {WebSocketResponseImpl} from '../../webSocket/response/webSocketResponseImpl';
import {WebSocketPayloadImpl} from '../../webSocket/webSocketPayload/webSocketPayloadImpl';
import {WebSocketResponse} from '../../webSocket/response/webSocketResponse';
import {TypedWebSocketResponse} from '../../webSocket/response/typedWebSocketResponse/typedWebSocketResponse';
import {NotebookIndexImpl} from '../../notebookIndex/notebookIndexImpl';
import {signal, WritableSignal} from '@angular/core';
import {NotebookIndex} from '../../notebookIndex/notebookIndex';
import {NotebookIndexCollectionBehavior} from '../behavior/notebookIndexCollectionBehavior';
import {NotebookIndexBehaviorImpl} from '../../notebookIndex/behavior/notebookIndexBehaviorImpl';
import {NotebookIndexBehavior} from '../../notebookIndex/behavior/notebookIndexBehavior';
import {NotebookStub} from '../../notebook/notebookStub';
import {NotebookIndexChannel} from '../../notebookIndex/channel/notebookIndexChannel';
import {PrintableNotebookIndex} from '../../notebookIndex/printable/printableNotebookIndex';
import {NotebookBuilderImpl} from '../../notebookBuilder/notebookBuilderImpl';
import {ParagraphBuilderImpl} from '../../paragraphBuilder/paragraphBuilderImpl';

export class NotebookIndexCollectionChannel implements Channel {
  private readonly _channel:Channel;
  private readonly _notebookIndices: WritableSignal<Map<string, NotebookIndex>>;
  private readonly _notebookIndexCollectionBehavior:NotebookIndexCollectionBehavior;

  constructor(channel:Channel, notebookIndices: WritableSignal<Map<string, NotebookIndex>>, notebookIndexCollectionBehavior:NotebookIndexCollectionBehavior) {
    this._channel = channel;
    this._notebookIndices = notebookIndices;
    this._notebookIndexCollectionBehavior = notebookIndexCollectionBehavior;
  }

  request(data: object): void {
    this._channel.request(data);
  }

  response(json: object): void {
    const webSocketResponse = new WebSocketResponseImpl(new WebSocketPayloadImpl(json));
    if(webSocketResponse.operation() === 'NOTES_INFO'){
      this.handleNotesInfoResponse(webSocketResponse);
    }
    else{
      this._notebookIndices().forEach(notebookIndex => notebookIndex.response(json));
    }
  }

  private handleNotesInfoResponse(webSocketResponse:WebSocketResponse):void{
    const notesInfoResponse = new TypedWebSocketResponse('NOTES_INFO', webSocketResponse);
    const notebookIndicesPayload = notesInfoResponse.dataAsWebSocketPayload().arrayProperty<object>('notes');
    this._notebookIndexCollectionBehavior.clear();
    notebookIndicesPayload.forEach(notebookIndexPayload => {
      const openedNotebook = signal(new NotebookStub());
      const notebookIndexBehavior:NotebookIndexBehavior = new NotebookIndexBehaviorImpl(new WebSocketPayloadImpl(notebookIndexPayload), openedNotebook);
      const notebookBuilder = new NotebookBuilderImpl(new ParagraphBuilderImpl());
      const notebookIndexChannel = new NotebookIndexChannel(this, openedNotebook, notebookIndexBehavior, notebookBuilder);
      const printableNotebookIndex = new PrintableNotebookIndex(openedNotebook);
      const notebookIndex = new NotebookIndexImpl(notebookIndexBehavior, notebookIndexChannel, printableNotebookIndex);
      this._notebookIndexCollectionBehavior.add(notebookIndex);
    });
  }
}
