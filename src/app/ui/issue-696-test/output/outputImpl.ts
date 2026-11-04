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
import {Output} from './output';
import {OutputView} from './outputView';
import {ViewNode} from '../viewNode/viewNode';
import {OutputState} from './outputState';
import {OutputFormat} from '../outputFormat/outputFormat';

export class OutputImpl implements Output, ViewNode<OutputView> {
  private readonly _childNodes:{interpreterErrorListener: object, outputSwitcher: object};
  private _outputView:OutputView;
  private readonly _outputFormats: Map<string, OutputFormat>;

  constructor(outputFormats: Map<string, OutputFormat>, childNodes?:{interpreterErrorListener: object, outputSwitcher: object}) {
    this._outputFormats = outputFormats;
    this._childNodes = childNodes;
  }

  attachView(view: OutputView): void {
    this._outputView = view;
    // this._outputView.attachInterpreterErrorListener(this._childNodes.interpreterErrorListener);
    // this._outputView.attachSwitcher(this._childNodes.outputSwitcher);
  }

  detachView(): void {
    this._outputView = undefined;
  }

  render(outputState:OutputState): void {
    if(this._outputView){
      const outputFormat = this._outputFormats.get(outputState.type);
      this._outputView.render(outputFormat.render(outputState.data, outputState.options));
    }
  }
}
