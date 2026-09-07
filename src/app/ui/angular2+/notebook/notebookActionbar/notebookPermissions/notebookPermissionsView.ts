import {Component} from '@angular/core';

@Component({
  selector: 'notebook-permissions',
  template: `
    <button class="btn btn-secondary setting-btn me-2"
            type="button"
            title="Notebook permissions">
      <i class="fas fa-unlock-keyhole"></i>
    </button>
  `
})
export class NotebookPermissionsView {

}
