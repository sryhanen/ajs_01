import {Component, Input} from '@angular/core';
import {Paragraph} from '../../../../../objects/paragraph/paragraph';
import {RunParagraphMessage} from '../../../../../objects/message/runParagraph/runParagraphMessage';
import {NgClass} from '@angular/common';
import {CancelParagraphMessage} from '../../../../../objects/message/cancelParagraph/cancelParagraphMessage';

@Component({
  selector: 'run-paragraph-button',
  imports: [
    NgClass
  ],
  template: `
    @let isParagraphRunning = paragraph.paragraphData().status().isRunning();
    @if(!isParagraphRunning){
      <i class="fas fa-play"
         role="button"
         title="Run this paragraph"
         [ngClass]="{'item-disable': isParagraphRunning}"
         (click)="runParagraph()">
      </i>
    }
    @else{
      <i class="fas fa-pause"
         role="button"
         title="Cancel paragraph run"
         [ngClass]="{'item-disable': isParagraphRunning}"
         (click)="cancelParagraphRun()">
      </i>
    }
  `
})
export class RunParagraphButton {
   @Input({required:true}) paragraph:Paragraph;

   runParagraph(){
      this.paragraph.request(new RunParagraphMessage(this.paragraph.paragraphData()).message());
   }

   cancelParagraphRun(){
     this.paragraph.request(new CancelParagraphMessage(this.paragraph.paragraphData().id()).message());
   }
}
