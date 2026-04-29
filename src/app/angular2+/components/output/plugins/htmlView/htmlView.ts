import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {HtmlPlugin} from '../../../../objects/output/plugins/htmlPlugin/htmlPlugin';

@Component({
  selector:'html',
  template: `
  <div #anchor class="plain-text"></div>
  `
})
export class HtmlView implements AfterViewInit{
  @Input({required:true}) plugin: HtmlPlugin;
  @ViewChild('anchor') anchor: ElementRef;

  ngAfterViewInit(){
    this.anchor.nativeElement.innerHTML = this.plugin.unsanitizedHtmlString();
  }
}
