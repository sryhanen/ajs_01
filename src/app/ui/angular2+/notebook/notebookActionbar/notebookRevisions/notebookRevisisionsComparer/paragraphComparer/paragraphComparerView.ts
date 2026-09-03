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
  ElementRef,
  inject,
  input,
  OnChanges,
  Renderer2,
  ViewChild
} from '@angular/core';
import {diffLines} from 'diff';

@Component({
  selector: 'paragraph-comparer',
  template: `
    <div #comparisonContainer></div>
  `
})
export class ParagraphComparerView implements AfterViewInit, OnChanges{
  paragraphId = input.required<string>();
  firstParagraphs = input.required<object[]>();
  secondParagraphs = input.required<object[]>();
  @ViewChild('comparisonContainer') comparisonContainer: ElementRef;
  private renderer = inject(Renderer2);

  ngAfterViewInit() {
    this.compareRevisionParagraphs();

  }

  ngOnChanges() {
    if(this.comparisonContainer){
      this.compareRevisionParagraphs();
    }
  }

  private compareRevisionParagraphs():void{
    const firstParagraph = this.firstParagraphs().find(paragraph => paragraph['id'] === this.paragraphId());
    const secondParagraph = this.secondParagraphs().find(paragraph => paragraph['id'] === this.paragraphId());
    let element: HTMLElement;
    if(!firstParagraph){
      element = this.paragraphAddedElement(secondParagraph);
    }
    else if(!secondParagraph){
      element = this.paragraphRemovedElement(firstParagraph);
    }
    else if(this.paragraphsEqual(firstParagraph, secondParagraph)){
      element = this.paragraphElement(firstParagraph);
    }
    else{
      element = this.paragraphDiffElement(firstParagraph, secondParagraph);
    }
    const containerElement = this.comparisonContainer.nativeElement;
    if(containerElement.firstChild){
      this.renderer.removeChild(containerElement, containerElement.firstChild);
    }
    this.renderer.appendChild(containerElement, element);
  }

  private paragraphsEqual(firstParagraph:object, secondParagraph:object):boolean{
    return firstParagraph['title'] === secondParagraph['title'] && firstParagraph['text'] === secondParagraph['text'];
  }

  private paragraphDiffElement(firstParagraph:object, secondParagraph:object):HTMLElement{
    const diff = diffLines(firstParagraph['text'], secondParagraph['text']);
    const diffElement = document.createElement('div');
    diff.forEach((changeObject: {value:string, added:boolean, removed:boolean, count:number}) => {
      const span = document.createElement('span');
      if(changeObject.added){
        span.append(document.createTextNode('+ '));
        span.classList.add('color-green-row');
      }
      else if(changeObject.removed){
        span.append(document.createTextNode('- '));
        span.classList.add('color-red-row');
      }
      span.append(document.createTextNode(changeObject.value));
      diffElement.appendChild(span);
    });
    return diffElement;
  }

  private paragraphAddedElement(paragraph: object):HTMLElement {
    const paragraphElement = this.paragraphElement(paragraph);
    const paragraphAddedElement = document.createElement('div');
    paragraphAddedElement.appendChild(document.createTextNode('Added: '));
    paragraphAddedElement.appendChild(paragraphElement);
    paragraphAddedElement.classList.add('color-green-row');
    return paragraphAddedElement;
  }

  private paragraphRemovedElement(paragraph: object):HTMLElement {
    const paragraphElement = this.paragraphElement(paragraph);
    const paragraphRemovedElement = document.createElement('div');
    paragraphRemovedElement.appendChild(document.createTextNode('Removed: '));
    paragraphRemovedElement.appendChild(paragraphElement);
    paragraphRemovedElement.classList.add('color-red-row');
    return paragraphRemovedElement;
  }

  private paragraphElement(paragraph: object):HTMLElement {
    const paragraphAddedElement = document.createElement('span');
    const titleText = paragraph['title'] ? paragraph['title'] : 'Untitled';
    const titleElement = document.createElement('h3');
    titleElement.textContent = titleText;
    paragraphAddedElement.appendChild(titleElement);
    const textElement = document.createElement('p');
    textElement.textContent = paragraph['text'];
    paragraphAddedElement.appendChild(textElement);
    return paragraphAddedElement;
  }
}
