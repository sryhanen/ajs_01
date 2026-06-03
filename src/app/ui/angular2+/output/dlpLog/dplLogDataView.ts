import {Component, Input, WritableSignal} from '@angular/core';
import {DplLogData} from '../../../../objects/output/dplLog/dplLogData/dplLogData';

@Component({
  selector: 'dpl-log-data',
  template: `
    <div class="dpl-log">
      <p>
        <button
          type="button"
          class="btn btn-secondary btn-small my-2"
          (click)="showLog = !showLog">
          Show/Hide log
        </button>
      </p>
      @if(showLog){
        <div id="log" class="log-message">
          <h3>Data Batch Status</h3>
          @if(!dplLogData().batchMessage().isStub()){
            <p class="batch-message">{{dplLogData().batchMessage().value()}}</p>
          }
          @if(!dplLogData().timeMessage().isStub()){
            <p>{{dplLogData().timeMessage().value()}}</p>
          }
          @if(!dplLogData().message().isStub()){
            <p class="overflow-auto">{{dplLogData().message().value()}}</p>
          }
        </div>
      }
    </div>
  `
})
export class DplLogDataView {
  @Input({required:true}) dplLogData:WritableSignal<DplLogData>;
  protected showLog = false;
}
