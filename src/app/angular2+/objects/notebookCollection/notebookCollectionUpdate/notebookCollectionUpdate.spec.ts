import {NotebookCollectionUpdate} from './notebookCollectionUpdate';
import {FakeChannel} from '../../channel/fakeChannel';
import {Channel} from '../../channel/channel';
import {Notebook} from '../../notebook/notebook';
import {PushValue} from '../../pushValue/pushValue';
import {PushValueImpl} from '../../pushValue/pushValueImpl';

describe('NotebookCollectionUpdate', () => {
    let channel:Channel;
    let notebookCollection: Notebook[];
    let pushValue: PushValue<Notebook[]>;
    let pushCollection: PushValue<Notebook[]>[];
    let notebookCollectionUpdate: NotebookCollectionUpdate;
    beforeEach(() => {
      channel  = new FakeChannel();
      notebookCollection = [];
      pushValue = new PushValueImpl();
      pushCollection = [pushValue];
      notebookCollectionUpdate = new NotebookCollectionUpdate(notebookCollection, pushCollection, channel);
    });

    describe('Birth', () => {
      it('Should be initialized', () => {
        expect(notebookCollectionUpdate).toBeInstanceOf(NotebookCollectionUpdate);
      });
    });

    describe('Collection updates', () => {
      const notebook1 = {name:'note1'};
      const notebook2 = {name:'note2'};
      const updateResponse = {
        op: 'NOTES_INFO',
        data: {
          notes: [
            notebook1,
            notebook2
          ]
        }
      };
      it('Updates notebookCollection and pushCollection', () => {
        expect(notebookCollection).toHaveLength(0);
        notebookCollectionUpdate.response(updateResponse);
        expect(notebookCollection).toHaveLength(2);
        expect(pushCollection[0].value()).toHaveLength(2);
      });
    });
});
