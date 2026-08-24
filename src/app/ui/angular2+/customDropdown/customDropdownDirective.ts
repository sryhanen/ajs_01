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
  Directive,
  input,
  ViewContainerRef,
  TemplateRef,
  ElementRef,
  inject
} from '@angular/core';

@Directive({
  selector: '[customDropdown]',
  exportAs: 'customDropdown',
  host: {
    '(click)': 'onClick()',
    '(document:click)':'onDocumentClick($event.target)'
  }
})
export class CustomDropdownDirective {
  dropdownContent = input.required<TemplateRef<unknown>>();
  protected isOpen= false;
  private dropdownMenuElement: HTMLElement;
  private elementRef = inject(ElementRef);
  private vcr = inject(ViewContainerRef);

  onClick() {
    this.toggleDropdown();
  }

  onDocumentClick(target: HTMLElement) {
    if (this.isOpen) {
      const clickedInsideButton = this.elementRef.nativeElement.contains(target);
      const clickedInsideMenu = this.dropdownMenuElement.contains(target);
      if (!clickedInsideButton && !clickedInsideMenu) {
        this.close();
      }
    }
  }

  private toggleDropdown() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  private open() {
    const viewRef = this.vcr.createEmbeddedView(this.dropdownContent());
    this.dropdownMenuElement = viewRef.rootNodes[0] as HTMLElement;
    if (this.dropdownMenuElement) {
      this.dropdownMenuElement.classList.add('custom-dropdown');
    }
    this.isOpen = true;
  }

  close() {
    this.vcr.clear();
    this.dropdownMenuElement = null;
    this.isOpen = false;
  }
}
