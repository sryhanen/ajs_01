import {Component, computed, input, model} from '@angular/core';
import {Requestable} from '../../../../../objects/channel/requestable';
import {CommitParagraphRequest} from '../../../../../objects/requests/commitParagraph/commitParagraphRequest';

@Component({
  selector: 'toggle-line-numbers',
  template: `
    <i class="fas fa-list-ol me-3"
       role="button"
       (click)="commitParagraphRequest()"
       title="{{hideLineNumbers() ? 'Hide' : 'Show' }} line numbers">
    </i>
  `
})
export class ToggleLineNumbersView {
  requestable = input.required<Requestable>();
  paragraphData = model.required<object>();
  hideLineNumbers = computed(() => this.paragraphData()['config']['lineNumbers']);

  protected commitParagraphRequest(): void {
    this.paragraphData.update(paragraphData => ({
      ...paragraphData,
      config:{
        ...paragraphData['config'],
        lineNumbers: !this.hideLineNumbers()
      }
    }));
    const commitParagraphRequest = new CommitParagraphRequest(this.requestable(), this.paragraphData());
    commitParagraphRequest.send();
  }
}
