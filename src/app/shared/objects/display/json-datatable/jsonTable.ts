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
import 'datatables.net-buttons-bs5';
import PaginationRequest from '../../communication/paginationRequest';
import {Data,  RequestParameters} from '../../../types/pagination';
import TableColumns from '../tableColumns';
import Pagination from './pagination';

/**
 * Initialize table
 * @param id - DOM id
 * @param paginationRequest new PaginationRequest()
 */
export default class JsonTable {
  private readonly _id: string;
  private readonly _paginationRequest: PaginationRequest;

  /**
   * Initialize table
   * @param id - DOM id
   * @param paginationRequest new PaginationRequest()
   */
  constructor(id: string, paginationRequest: PaginationRequest) {
    this._id = id;
    this._paginationRequest = paginationRequest;
  }

  /**
   * Completely remove the table from the DOM.
   */
  purgeTable(){
    $(`#${this._id}`).DataTable().destroy(true);
  }

  create(tableColumns: TableColumns, dataRows:Data, pagination: Pagination, visibleColumns = tableColumns.defaultVisible()) {
    const request = this._paginationRequest;
    const columnDefs = tableColumns.escapeHtml().concat(visibleColumns);
    $(`#${this._id}`).DataTable({
      ajax: function (requestParameters: RequestParameters, callback, settings){
        callback(dataRows);
        request.sendRequest(requestParameters);
      },
      columns: tableColumns.displayed(),
      lengthMenu: [1, 5, 10, 25, 50, 100, 250],
      language: {
        paginate: {
          first: 'First',
          last: 'Last',
          previous: 'Previous',
          next: 'Next'
        }
      },
      columnDefs: columnDefs,
      layout: {
        topStart: {
          buttons: ['colvis', 'copyHtml5', 'csvHtml5', 'print']
        },
        topEnd: 'pageLength',
        bottomStart: 'info',
      },
      destroy: true,
      serverSide: true,
      ordering: false,
      processing: true,
      displayStart: pagination.start(),
      pageLength: pagination.length(),
    });
  }

  pagination(){
    const table = this.#tableInstance();
    return table.page.info();
  }

  visibleColumns(){
    const table = this.#tableInstance();
    // DataTables type definitions think that this is a boolean value.
    // Actually the type is API instance with current result set: type = API & {<column index>:true/false}
    return (table.columns().visible() as any).toArray();
  }

  #tableInstance(){
    return $(`#${this._id}`).DataTable();
  }
}
