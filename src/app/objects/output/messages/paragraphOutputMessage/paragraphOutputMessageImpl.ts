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
import {ParagraphOutputMessage} from './paragraphOutputMessage';
import {MessageImpl} from '../../../message/messageImpl';
import {SafeJsonImpl} from '../../../safeJson/safeJsonImpl';
import {Message} from '../../../message/message';
import {SafeJson} from '../../../safeJson/safeJson';
import {IsAggregated} from './isAggregated/isAggregated';
import {IsAggregatedImpl} from './isAggregated/isAggregatedImpl';
import {IsAggregatedStub} from './isAggregated/isAggregatedStub';

export class ParagraphOutputMessageImpl implements ParagraphOutputMessage {
  private readonly _json:object;

  constructor(json:object) {
    this._json = json;
  }

  output():object {
    const message = this.message();
    this.validateMessage(message);
    const safeData = this.safeData(message);
    return safeData.getProperty('output', 'object');
  }

  isAggregated(): IsAggregated {
    const message = this.message();
    this.validateMessage(message);
    const safeData = this.safeData(message);
    let isAggregated:IsAggregated;
    if(safeData.propertyExists('isAggregated')) {
      isAggregated = new IsAggregatedImpl(new SafeJsonImpl(safeData.getProperty('output', 'object')).getProperty('isAggregated', 'boolean'));
    }
    else{
      isAggregated = new IsAggregatedStub();
    }
    return isAggregated;
  }

  type(): string {
    const message = this.message();
    this.validateMessage(message);
    const safeData = this.safeData(message);
    return new SafeJsonImpl(safeData.getProperty('output', 'object')).getProperty('type', 'string');
  }

  private safeData(message:Message): SafeJson{
    return new SafeJsonImpl(message.data());
  }

  private validateMessage(message:Message): void{
    if(message.operation() !== 'PARAGRAPH_OUTPUT'){
      throw new RangeError('Message operation is not "PARAGRAPH_OUTPUT".');
    }
  }

  private message(): Message {
    return new MessageImpl(new SafeJsonImpl(this._json));
  }
}
