import {Response} from '../../channel/response';
import {Notebook} from '../../notebook/notebook';
import {PushValue} from '../../pushValue/pushValue';
import {MessageImpl} from '../../message/messageImpl';
import {SafeJsonImpl} from '../../safeJson/safeJsonImpl';
import {Channel} from '../../channel/channel';
import {NotebookImpl} from '../../notebook/notebookImpl';

export class NotebookCollectionUpdate implements Response{
  private readonly _channel: Channel;
  private readonly _notebookCollection: Notebook[];
  private readonly _pushCollection: PushValue<Notebook[]>[];

  constructor(notebookCollection: Notebook[], pushCollection:PushValue<Notebook[]>[], channel: Channel) {
    this._notebookCollection = notebookCollection;
    this._pushCollection = pushCollection;
    this._channel = channel;
  }

  response(data: object) {
    const message = new MessageImpl(new SafeJsonImpl(data));
    const operation = message.operation();
    if(operation === 'NOTES_INFO'){
      this.clearCollection();
      const messageData = new SafeJsonImpl(message.data());
      const notes = messageData.getProperty<Array<object>>('notes', 'object');
      notes.forEach(note => {
        this._notebookCollection.push(new NotebookImpl(this._channel, note));
      });
      this._pushCollection.forEach(value => value.update(this._notebookCollection));
    }
  }

  private clearCollection(): void {
    const length = this._notebookCollection.length;
    this._notebookCollection.splice(0, length);
  }
}

