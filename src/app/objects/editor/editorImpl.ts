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
import {Editor} from './editor';
import {computed, signal, Signal} from '@angular/core';
import {RenderNode} from '../rendering/renderNode/renderNode';
import {Channel} from '../channel/channel';
import {ComponentView} from '../rendering/componentView/componentView';
import {ComponentViewImpl} from '../rendering/componentView/componentViewImpl';
import {EditorView} from '../../ui/angular2+/editor/editorView';
import {ChannelNodeImpl} from '../channel/channelNode/channelNodeImpl';
import {ChannelNode} from '../channel/channelNode/channelNode';

export class EditorImpl implements Editor {
  private readonly _channel:Channel;
  private readonly _componentView:ComponentView;
  private readonly _channelNode:ChannelNode;
  private readonly _paragraphId:string;

  constructor(channel:Channel, paragraphData: object) {
    this._channel = channel;
    this._paragraphId = paragraphData['id'];
    this._channelNode = new ChannelNodeImpl(this);
    this._componentView = new ComponentViewImpl(EditorView, signal({channelNode: this._channelNode, paragraphData: paragraphData}));
  }

  print(): Signal<RenderNode> {
    return computed(() => ({
      paragraphId:this._paragraphId,
      children: signal([]),
      componentView:this._componentView
    }));
  }

  request(json: object): void {
    this._channel.request(json);
  }

  response(json: object): void {
    this._channelNode.response(json);
  }
}
