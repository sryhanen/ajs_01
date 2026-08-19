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
import {Component, computed, input} from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'paragraph-execution-time',
  template: `
    @if(!paragraphData()['config']['tableHide']){
      <div class="execution-time">
        {{executionTimeText()}}
      </div>
    }
  `
})
export class ParagraphExecutionTimeView {
  paragraphData = input.required<object>();
  executionTimeText = computed(() => this.calculateExecutionTime());

  protected calculateExecutionTime():string {
    let executionTimeText:string;
    const dateStarted = this.paragraphData()['dateStarted'];
    const dateFinished = this.paragraphData()['dateFinished'];
    const timeElapsed = Date.parse(dateFinished) - Date.parse(dateStarted);
    if(timeElapsed < 0 || isNaN(timeElapsed)){
      executionTimeText = 'Outdated.';
    }
    else{
      const duration = moment.duration(timeElapsed / 1000, 'seconds');
      const hours = Math.floor(duration.asHours());
      const minutes = duration.minutes();
      const seconds = duration.seconds();
      const formattedDuration = [
        hours.toString().padStart(2, '0').concat('h'),
        minutes.toString().padStart(2, '0').concat('m'),
        seconds.toString().padStart(2, '0').concat('s')
      ].join(' ');

      const endFormat = moment(dateFinished).format('MMMM DD YYYY, h:mm:ss A');
      const user =  this.paragraphData()['user'];
      const userText = user !== undefined ? user : 'anonymous';
      executionTimeText  = `Took ${formattedDuration}. Last updated by ${userText} at ${endFormat}.`;
    }
    return executionTimeText;
  }
}
