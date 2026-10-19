import {Component, computed, input, model, output} from '@angular/core';

@Component({
  selector: 'toggle-editor-button',
  template: `
    <button class="bg-transparent border-0 p-0" (click)="changeEditorVisibility()">
      <i [class]="classNames()"
         [title]="title()">
      </i>
    </button>
  `
})
export class ToggleEditorButton {
  editorIsVisible = model.required<boolean>();
  editorVisibilityChanged = output<boolean>();

  classNames = computed(() => {
    return this.editorIsVisible() ? 'me-3 fas fa-expand' : 'me-3 fas fa-compress';
  });
  title = computed(() => {
    return this.editorIsVisible() ? 'Show editor' : 'Hide editor';
  });

  changeEditorVisibility() {
    this.editorIsVisible.set(!this.editorIsVisible());
    this.editorVisibilityChanged.emit(this.editorIsVisible());
  }
}
