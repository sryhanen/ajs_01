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
import {OutputFormat} from '../outputFormat';
import {OutputSwitcherButton} from '../../switcher/button/outputSwitcherButton';
import {OutputSwitcherButtonStub} from '../../switcher/button/outputSwitcherButtonStub';
import {Channel} from '../../../channel/channel';
import {AngularView} from '../../../../components/output/plugins/angular/angularView';
import {AngularObjectCollection} from '../../../angularObjectCollection/angularObjectCollection';
import {MessageDTO} from '../../../message/messageDTO';
import {ParagraphOutputMessageImpl} from '../../../message/paragraphOutputMessage/paragraphOutputMessageImpl';
import {ParagraphOutputDTO} from '../../../message/paragraphOutputMessage/paragraphOutputDTO';
import { ContainerRef } from '../../../containerRef/containerRef';
import {AngularPlugin} from '../../plugins/angularPlugin/angularPlugin';
import {AngularPluginStub} from '../../plugins/angularPlugin/angularPluginStub';

export class AngularFormat implements OutputFormat {
  private readonly _channel: Channel;
  private readonly _switcherButtons: OutputSwitcherButton[];
  private readonly _viewComponent: new () => AngularView;
  private readonly _containerRefs: ContainerRef[];
  private readonly _pluginStub:AngularPlugin;
  private _plugin:AngularPlugin;
  private readonly _angularObjectCollection:AngularObjectCollection;

  constructor(channel: Channel, angularObjectCollection:AngularObjectCollection) {
    this._channel = channel;
    this._angularObjectCollection = angularObjectCollection;
    this._switcherButtons = [new OutputSwitcherButtonStub()];
    this._pluginStub = new AngularPluginStub();
    this._plugin = this._pluginStub;
    this._viewComponent = AngularView;
    this._containerRefs = [];
  }

  pushContainerRef(value: ContainerRef): void {
    this._containerRefs.push(value);
    if(!this._plugin.isStub()){
      value.createComponent(this._viewComponent, this.componentInputs());
    }
  }

  request(data: object): void {
    this._channel.request(data);
  }

  response(data: object): void {
    const message = data as MessageDTO<unknown>;
    if(message.op === 'PARAGRAPH_OUTPUT'){
      const paragraphOutputMessage = new ParagraphOutputMessageImpl(message.data as ParagraphOutputDTO);
      const output = paragraphOutputMessage.toOutput();
      if(output.isStub()){
        this._plugin = this._pluginStub;
        this._containerRefs.forEach(containerRef => containerRef.clear());
      }
      else {
        this._containerRefs.forEach(containerRef => containerRef.clear());
        this._plugin = output.toAngularPlugin(this._channel);
        if(!this._plugin.isStub()){
          this._containerRefs.forEach(containerRef => containerRef.createComponent(this._viewComponent, this.componentInputs()));
        }
      }
    }
  }

  switcherButtons(): OutputSwitcherButton[] {
    return this._switcherButtons;
  }

  private componentInputs(): {name: string; value: unknown}[] {
    return [
      {name:'plugin', value:this._plugin},
      {name:'angularObjectCollection', value:this._angularObjectCollection}
    ];
  }
}
