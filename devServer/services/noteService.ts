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
import {SerializedDataService} from '../interfaces/common';
import FileService from './fileService';
import {NotebookDTO} from '../types/notebookDTO';
import Notebook from '../data/note/notebook';
import Paragraph from '../data/paragraph/paragraph';
import ParagraphCollection from '../data/paragraph/paragraphCollection';
import ParagraphResult from '../data/paragraph/paragraphResult';

export default class NoteService implements SerializedDataService<Notebook>{
  private readonly _fileService: FileService;
  private _lastNoteId: string;

  constructor(fileService: FileService) {
    this._fileService = fileService;
  }

  all(){
    const notes = this._fileService.readAll<NotebookDTO>();
    const notebookList: Notebook[] =[];
    for(const note of notes){
      notebookList.push(this.instantiateNotebook(note));
    }
    return notebookList;
  }

  find(notebookId:string){
    const notebook = this._fileService.read<NotebookDTO>(notebookId);
    this._lastNoteId = notebookId;
    return this.instantiateNotebook(notebook);
  }

  add(notebook:Notebook, id:string){
    this._fileService.write<NotebookDTO>(notebook.serialized(), id, false);
  }

  update(notebook:Notebook, id:string){
    this._fileService.write<NotebookDTO>(notebook.serialized(), id, true);
  }

  lastNoteId(){
    return this._lastNoteId;
  }

  private instantiateNotebook(notebookData:NotebookDTO): Notebook{
    const paragraphs = [];
    for(const paragraph of notebookData.paragraphs){
      let result: ParagraphResult;
      if(paragraph.results !== undefined && paragraph.results.code !== undefined  && paragraph.results.msg !== undefined){
        result = new ParagraphResult(paragraph.results.code, paragraph.results.msg[0].type, paragraph.results.msg[0].data);
      }
      else{
        result = new ParagraphResult();
      }
      const para = new Paragraph(paragraph.status, result, paragraph.text, paragraph.title,paragraph.id);
      paragraphs.push(para);
    }
    const paraCollection = new ParagraphCollection(paragraphs);
    return new Notebook(notebookData.name, paraCollection, notebookData.id);
  }
}
