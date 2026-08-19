import {Component, computed, input} from '@angular/core';

@Component({
  selector: 'run-time-status-view',
  template: `
    <span
      class="me-2"
      [class]="statusClassName()">
    {{ paragraphStatus() }}
    </span>
  `
})
export class RunTimeStatusView {
  paragraphData = input.required<object>();
  paragraphStatus = computed(() => this.paragraphData()['status']);
  paragraphIsRunning = computed(() => this.paragraphStatus() === 'RUNNING');
  paragraphIsPending = computed(() => this.paragraphStatus() === 'PENDING');
  statusClassName = computed(() => {
    let className = '';
    if(this.paragraphIsRunning()){
      className = 'status-running';
    }
    else if(this.paragraphIsPending()){
      className = 'status-pending';
    }
    return className;
  });
}
