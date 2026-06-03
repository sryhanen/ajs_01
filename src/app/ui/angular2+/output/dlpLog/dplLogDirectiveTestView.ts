import {DplLogDirective} from './dplLogDirective';
import {Component, Input} from '@angular/core';
import {DplLog} from '../../../../objects/output/dplLog/dplLog';

@Component({
  template: `
    <div dpl-log [dplLog]="dplLog"></div>
  `,
  imports: [DplLogDirective],
})
export class DplLogDirectiveTestView {
  @Input({required: true}) dplLog: DplLog;
}
