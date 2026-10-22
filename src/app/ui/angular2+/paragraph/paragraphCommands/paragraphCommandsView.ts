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
import {Component, ElementRef, input, ViewChild} from '@angular/core';
import {Editor} from '../../../../objects/editor/editor';
import {Paragraph} from '../../../../objects/paragraph/paragraph';
import {Output} from '../../../../objects/output/output';
import * as bootstrap from 'bootstrap';

@Component({
  selector:'paragraph-commands',
  template: `
    <div class="d-flex gap-3 align-items-center">
      <button class="btn bg-transparent border-0 shadow-none p-0 text-secondary"
              aria-label="Run paragraph" title="Run paragraph" (click)="paragraph().run()">
        <i class="fa-solid fa-play"></i>
      </button>
      <button class="btn bg-transparent border-0 shadow-none p-0 text-secondary"
              aria-label="Clear output" title="Clear output" (click)="editor().clear()">
        <i class="fa-solid fa-eraser"></i>
      </button>
      <button class="btn bg-transparent border-0 shadow-none p-0 text-secondary"
              aria-label="Clone paragraph" title="Clone paragraph" (click)="paragraph().clone()">
        <i class="fa-solid fa-copy"></i>
      </button>
      <button class="btn bg-transparent border-0 shadow-none p-0 text-secondary"
              aria-label="Link to paragraph" title="Link to paragraph" (click)="pasteParagraphLink()">
        <i class="fa-solid fa-link"></i>
      </button>
      <button class="btn bg-transparent border-0 shadow-none p-0 text-secondary"
              aria-label="Clear output" title="Clear output" (click)="output().clear()">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
    <div class="position-relative">
      <div #copyLinkToast class="toast position-fixed bottom-0 end-0 p-3" style="z-index:9999" role="alert" aria-atomic="true">
        <div class="toast-body">
          Paragraph link added to clipboard.
        </div>
      </div>
    </div>
  `
})
export class ParagraphCommandsView {
  editor = input.required<Editor>();
  output = input.required<Output>();
  paragraph = input.required<Paragraph>();

  @ViewChild('copyLinkToast') copyLinkToast!: ElementRef;

  protected async pasteParagraphLink(): Promise<void>{
    const baseUrl = window.location.href;
    const urlWithParagraphLink = `${baseUrl}#${this.paragraph().id()}`;
    await navigator.clipboard.writeText(urlWithParagraphLink);
    const toast = new bootstrap.Toast(this.copyLinkToast.nativeElement,{
      delay:1000,
      autohide:true
    });
    toast.show();
  }
}
