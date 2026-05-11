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
import {TextView} from '../../../../components/output/plugins/textView/textView';
import {ContainerRef} from '../../../containerRef/containerRef';
import {TextPluginStub} from '../../plugins/textPlugin/textPluginStub';
import {OutputType} from '../../outputType';
import {SafeJsonImpl} from '../../../safeJson/safeJsonImpl';
import {TextPluginImpl} from '../../plugins/textPlugin/textPluginImpl';
import {TextPlugin} from '../../plugins/textPlugin/textPlugin';

export class TextFormat implements OutputFormat {
  private readonly _switcherButtons: OutputSwitcherButton[];
  private readonly _viewComponent: new () => TextView;
  private readonly _containerRefs: ContainerRef[];
  private readonly _pluginStub: TextPlugin;
  private _plugin: TextPlugin;
  private readonly _outputType: string;

  constructor() {
    this._outputType = OutputType.text;
    this._viewComponent = TextView;
    this._switcherButtons = [];
    this._containerRefs = [];
    this._pluginStub = new TextPluginStub();
    this._plugin = this._pluginStub;
  }

  pushContainerRef(value:ContainerRef): void {
    this._containerRefs.push(value);
    if(!this._plugin.isStub()){
      value.createComponent(this._viewComponent, [{name:'plugin', value: this._plugin}]);
    }
  }

  switcherButtons(): OutputSwitcherButton[] {
    return this._switcherButtons;
  }

  outputType(): string {
    return this._outputType;
  }

  render(paragraphOutputData:object): void {
    const safeParagraphOutputData = new SafeJsonImpl(paragraphOutputData);
    const outputData:object = safeParagraphOutputData.getProperty('data', 'object');
    const data:string = new SafeJsonImpl(outputData).getProperty('data', 'string');
    this._plugin = new TextPluginImpl(data);
    this._containerRefs.forEach(containerRef => {
      containerRef.createComponent(this._viewComponent, [{name:'plugin', value:this._plugin}]);
    });
  }

  clear(): void {
    this._plugin = this._pluginStub;
    this._containerRefs.forEach(containerRef => containerRef.clear());
  }
}
