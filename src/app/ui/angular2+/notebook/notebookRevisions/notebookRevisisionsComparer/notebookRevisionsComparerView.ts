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
import {
  AfterViewInit,
  Component,
  computed, DOCUMENT, ElementRef, inject,
  input,
  OnInit, Renderer2, ViewChild,
} from '@angular/core';
import {RevisionCommit} from '../../../../../objects/revisionCommit/revisionCommit';
import {Requestable} from '../../../../../objects/channel/requestable';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {
  NoteRevisionForCompareRequest
} from '../../../../../objects/requests/noteRevisionForCompare/noteRevisionForCompareRequest';
import {ParagraphComparerView} from './paragraphComparer/paragraphComparerView';

@Component({
  selector: 'notebook-revisions-comparer',
  template: `
    <button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#compareRevisionsDialog">
      <i class="fas fa-solid fa-code-compare"></i>
    </button>
    <div class="modal fade" id="compareRevisionsDialog" tabindex="-1" aria-hidden="true" #compareRevisionsDialog>
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Compare Versions</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="container">
              <form [formGroup]="revisionsFetchForm">
                <div class="row">
                  <div class="col">
                    <label for="paragraph-select" class="me-2">Paragraph</label>
                    <select id="paragraph-select" class="rounded-2 paragraph-select" formControlName="paragraph">
                      <option value="">Select paragraph</option>
                      @for (paragraphOption of paragraphOptions(); track $index) {
                        @let titleText = paragraphOption.title ? paragraphOption.title : 'Untitled';
                        <option [value]="paragraphOption.id">{{ titleText }}</option>
                      }
                    </select>
                  </div>
                  <div class="col-auto text-end">
                    <label for="first-commit-select" class="me-2">Version</label>
                    <select id="first-commit-select" class="rounded-2 me-2 revision-select"
                            formControlName="firstRevisionCommitId">
                      <option value="">Select commit</option>
                      @for (revisionCommit of revisionCommits(); track $index) {
                        <option [value]="revisionCommit.id">{{ revisionCommit.message }}</option>
                      }
                    </select>
                    <label for="second-commit-select" class="me-2">compare with</label>
                    <select id="second-commit-select" class="rounded-2 revision-select"
                            formControlName="secondRevisionCommitId">
                      <option value="">Select commit</option>
                      @for (revisionCommit of revisionCommits(); track $index) {
                        <option [value]="revisionCommit.id">{{ revisionCommit.message }}</option>
                      }
                    </select>
                  </div>
                </div>
              </form>
              <div class="row">
                <div class="col">
                  @let paragraphId = revisionsFetchForm.get('paragraph').value;
                  @if (paragraphId !== '') {
                    <paragraph-comparer [firstParagraphs]="firstRevisionParagraphs()"
                                        [secondParagraphs]="secondRevisionParagraphs()"
                                        [paragraphId]="paragraphId"
                                        >
                    </paragraph-comparer>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  host: {
    'class': 'btn-group',
  },
  imports: [
    ReactiveFormsModule,
    ParagraphComparerView
  ],
  styles: `
    .revision-select {
      min-width: 9.5em;
    }
    .paragraph-select {
      min-width: 10.5em;
    }
  `
})
export class NotebookRevisionsComparerView implements OnInit, AfterViewInit {
  requestable = input.required<Requestable>();
  revisionCommits = input.required<RevisionCommit[]>();
  revisionsToCompare= input.required<Map<string, object>>();
  firstRevision = computed(() => this.revisionsToCompare().get(this.revisionsFetchForm.get('firstRevisionCommitId').value));
  secondRevision = computed(() => this.revisionsToCompare().get(this.revisionsFetchForm.get('secondRevisionCommitId').value));
  firstRevisionParagraphs = computed(() => {
    let firstRevisionParagraphs = [];
    if(this.firstRevision()){
      firstRevisionParagraphs = this.firstRevision()['paragraphs'];
    }
    return firstRevisionParagraphs;
  });
  secondRevisionParagraphs = computed(() => {
    let secondRevisionParagraphs = [];
    if(this.secondRevision()){
      secondRevisionParagraphs = this.secondRevision()['paragraphs'];
    }
    return secondRevisionParagraphs;
  });
  paragraphOptions = computed(() => {
    return [...this.firstRevisionParagraphs(), ...this.secondRevisionParagraphs()].map(paragraph => ({id:paragraph['id'], title:paragraph['title']}));
  });

  revisionsFetchForm = new FormGroup({
    paragraph: new FormControl({value:'', disabled:true}),
    firstRevisionCommitId: new FormControl(''),
    secondRevisionCommitId: new FormControl('')
  });

  ngOnInit() {
    this.revisionsFetchForm.get('firstRevisionCommitId').valueChanges.subscribe((revisionCommitId) => this.noteRevisionRequest(revisionCommitId, 'first'));
    this.revisionsFetchForm.get('secondRevisionCommitId').valueChanges.subscribe((revisionCommitId) => this.noteRevisionRequest(revisionCommitId, 'second'));
    this.revisionsFetchForm.valueChanges.subscribe(values => {
      const paragraphControl = this.revisionsFetchForm.get('paragraph');
      if(values.firstRevisionCommitId !== '' && values.secondRevisionCommitId !== ''){
        paragraphControl.enable({ emitEvent: false });
      }
      else{
        paragraphControl.disable({ emitEvent: false });
      }
    });
  }

  @ViewChild('compareRevisionsDialog') modalElement!: ElementRef;
  private renderer = inject(Renderer2);
  private document = inject(DOCUMENT);

  ngAfterViewInit():void {
    this.renderer.appendChild(this.document.body, this.modalElement.nativeElement);
  }

  private noteRevisionRequest(revisionCommitId:string, position:string):void{
    if(revisionCommitId){
      const noteRevisionForCompareRequest = new NoteRevisionForCompareRequest(this.requestable(), revisionCommitId, position);
      noteRevisionForCompareRequest.send();
    }
  }
}
