import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {OutputPlugin} from '../../../../objects/output/plugins/outputPlugin';

@Component({
  selector:'html',
  template: `
  <div #anchor></div>
  `
})
export class HtmlView implements AfterViewInit{
  @Input({required:true}) plugin: OutputPlugin;
  @ViewChild('anchor') anchor: ElementRef;

  ngAfterViewInit(){
    this.plugin.render(this.anchor.nativeElement);
  }
}
