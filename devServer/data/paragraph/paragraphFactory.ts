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
import Paragraph from './paragraph';
import SparkPara from './sparkPara';
import DataService from '../../services/dataService';
import ParagraphCollection from './paragraphCollection';
import ParagraphResult from './paragraphResult';
import {AggregatedData, PaginatedData, ResultType} from '../../types/resultData';

export default class ParagraphFactory{

  private readonly _sparkPara: Paragraph;
  private readonly _dataService : DataService;

  constructor() {
    this._sparkPara = new SparkPara();
    this._dataService = new DataService();
  }

  paragraphCollection(){
    const code = 'SUCCESS';
    const paginatedData: PaginatedData = {
      headers:this._dataService.headers(10),
      data: this._dataService.paginated(this._dataService.rawData(10, 25), 0, 25),
      draw: 1,
      recordsTotal: 1000,
      recordsFiltered: 1000,
    };
    const result1 = new ParagraphResult(code, ResultType.JSONTABLE, paginatedData);
    const para1 = new Paragraph('FINISHED', result1,'%dpl\n *raw data query*', '');

    const aggregatedData: AggregatedData = this._dataService.aggregatedData(10, 1000);
    const result2 = new ParagraphResult(code, ResultType.TABLE, aggregatedData);
    const para2 = new Paragraph('FINISHED', result2, '%dpl\n *Aggregated data query*', '');

    const result3 = new ParagraphResult('ERROR', ResultType.TEXT, 'foo bar text test test 123 123 123 1');
    const para3 = new Paragraph('FINISHED', result3,'%dpl\n *raw data query*', '');

    return new ParagraphCollection([para1, para2, para3, this._sparkPara]);
  }
}
