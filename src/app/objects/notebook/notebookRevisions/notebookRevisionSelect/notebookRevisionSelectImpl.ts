/*
 * Teragrep User Interface (ajs_01)
 * Copyright (C) 2019-2026 Suomen Kanuuna Oy
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 *
 * Additional permission under GNU Affero General Public License version 3
 * section 7
 *
 * If you modify this Program, or any covered work, by linking or combining it
 * with other code, such other code is not for that reason alone subject to any
 * of the requirements of the GNU Affero GPL version 3 as long as this Program
 * is the same Program as licensed from Suomen Kanuuna Oy without any additional
 * modifications.
 *
 * Supplemented terms under GNU Affero General Public License version 3
 * section 7
 *
 * Origin of the software must be attributed to Suomen Kanuuna Oy. Any modified
 * versions must be marked as "Modified version of" The Program.
 *
 * Names of the licensors and authors may not be used for publicity purposes.
 *
 * No rights are granted for use of trade names, trademarks, or service marks
 * which are in The Program if any.
 *
 * Licensee must indemnify licensors and authors for any liability that these
 * contractual assumptions impose on licensors and authors.
 *
 * To the extent this program is licensed as part of the Commercial versions of
 * Teragrep, the applicable Commercial License may apply to this file if you as
 * a licensee so wish it.
 */
import {NotebookRevisionSelect} from './notebookRevisionSelect';
import {computed, signal, Signal, WritableSignal} from '@angular/core';
import {ComponentView} from '../../../rendering/componentView/componentView';
import {Channel} from '../../../channel/channel';
import {ResponseRegister} from '../../../register/responseRegister/responseRegister';
import {ResponseRegisterImpl} from '../../../register/responseRegister/responseRegisterImpl';
import {RevisionCommit} from '../../../revisionCommit/revisionCommit';
import {ComponentViewImpl} from '../../../rendering/componentView/componentViewImpl';
import {NotebookRevisionSelectView} from '../../../../ui/angular2+/notebook/notebookRevisions/notebookRevisionSelect/notebookRevisionSelectView';
import {NoteRevisionMessageImpl} from '../../../message/noteRevisionMessage/noteRevisionMessageImpl';
import {SafeJsonImpl} from '../../../safeJson/safeJsonImpl';
import {MessageImpl} from '../../../message/messageImpl';
import {RevisionNotebook} from '../../../revisions/notebook/revisionNotebook';
import {ComponentViewStub} from '../../../rendering/componentView/componentViewStub';

export class NotebookRevisionSelectImpl implements NotebookRevisionSelect {
  private readonly _channel: Channel;
  private readonly _revisionCommits: Signal<RevisionCommit[]>;
  private readonly _selectedNotebookRevision: WritableSignal<ComponentView>;
  private readonly _responseRegister:ResponseRegister;
  private readonly _componentView:ComponentView;

  constructor(channel:Channel, revisionCommits: Signal<RevisionCommit[]>) {
    this._channel = channel;
    this._revisionCommits = revisionCommits;
    this._selectedNotebookRevision = signal(new ComponentViewStub());
    this._componentView = new ComponentViewImpl(NotebookRevisionSelectView, computed(() => ({
      requestable:this,
      revisionCommits: this._revisionCommits(),
      selectedNotebookRevision: this._selectedNotebookRevision(),
    })));
    this._responseRegister = new ResponseRegisterImpl();
    this._responseRegister.register('NOTE_REVISION', (json) => this.noteRevisionResponse(json));
  }

  print(): Signal<ComponentView> {
    return signal(this._componentView);
  }

  request(json: object): void {
    this._channel.request(json);
  }

  response(json: object): void {
    this._responseRegister.response(json);
  }

  private noteRevisionResponse(json:object):void{
    const noteRevisionMessage = new NoteRevisionMessageImpl(new MessageImpl(new SafeJsonImpl(json)));
    const revisionNotebook = new RevisionNotebook(noteRevisionMessage.note());
    this._selectedNotebookRevision.set(revisionNotebook.print()());
  }
}
