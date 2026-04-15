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
import ParagraphResult from './paragraphResult';
import {IParagraph} from '../../interfaces/paragraph';


export default class Paragraph implements IParagraph{
  private readonly _id: string;
  private _status:string;
  private readonly _dateCreated = Date.now();
  private readonly _dateFinished = Date.now();
  private readonly _dateStarted = Date.now();
  private readonly _dateUpdated = Date.now();
  private readonly _jobName = 'generated-job-id';
  private readonly _progressUpdateIntervalMs= 500;
  private _progress = 100;
  private readonly _text:string;
  private readonly _title:string;
  private _result: ParagraphResult;
  private readonly _settings = {
    params:{},
    forms:{}
  };
  private readonly _config = {
    lineNumbers: true,
    editorSetting: {
      language: 'dpl',
      editOnDblClick: false,
      completionKey: 'TAB',
      completionSupport: true
    },
    colWidth: 12.0,
    editorMode: 'ace/mode/dpl',
    fontSize: 9.0,
    title: true,
    results: {},
    enabled: true
  };

  constructor(status:string, result:ParagraphResult, text?:string, title?:string, id= 'p'.concat(Math.random().toString(36).slice(2, 12))){
    this._id = id;
    this._status = status;
    this._text = text;
    this._title = title;
    this._result = result;
  }

  result(){
    return this._result;
  }

  updateResult(result: ParagraphResult) {
    this._result = result;
  }

  serialized(){
    return {
      dateCreated: this._dateCreated,
      dateFinished: this._dateFinished,
      dateStarted: this._dateStarted,
      dateUpdated: this._dateUpdated,
      id: this._id,
      jobName: this._jobName,
      progress:this._progress,
      progressUpdateIntervalMs:this._progressUpdateIntervalMs,
      results: this._result.serialized(),
      status: this._status,
      text: this._text,
      title: this._title,
      user: this._title,
      settings: this._settings,
      config: this._config
    };
  }

  id(){
    return this._id;
  }

  updateStatus(status: string) {
    this._status = status;
  }

  updateProgress(progress: number) {
    this._progress = progress;
  }
}
