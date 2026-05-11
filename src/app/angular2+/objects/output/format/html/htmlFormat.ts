import {OutputFormat} from '../outputFormat';
import {ContainerRef} from '../../../containerRef/containerRef';
import {OutputSwitcherButton} from '../../switcher/button/outputSwitcherButton';
import {Channel} from '../../../channel/channel';
import {MessageDTO} from '../../../message/messageDTO';
import {ParagraphOutputMessageImpl} from '../../../message/paragraphOutputMessage/paragraphOutputMessageImpl';
import {ParagraphOutputDTO} from '../../../message/paragraphOutputMessage/paragraphOutputDTO';
import {HtmlPlugin} from '../../plugins/htmlPlugin/htmlPlugin';
import {HtmlPluginStub} from '../../plugins/htmlPlugin/htmlPluginStub';
import {HtmlView} from '../../../../components/output/plugins/htmlView/htmlView';

export class HTMLFormat implements OutputFormat{
  private readonly _channel:Channel;
  private readonly _containerRefs:ContainerRef[];
  private readonly _htmlPluginStub: HtmlPlugin;
  private _htmlPlugin: HtmlPlugin;
  private readonly _component: new () => HtmlView;

  constructor(channel:Channel) {
    this._channel = channel;
    this._containerRefs = [];
    this._htmlPluginStub = new HtmlPluginStub();
    this._htmlPlugin = this._htmlPluginStub;
    this._component = HtmlView;
  }

  pushContainerRef(value: ContainerRef): void {
    this._containerRefs.push(value);
    if(!this._htmlPlugin.isStub()){
      value.createComponent(this._component, [{name:'plugin', value:this._htmlPlugin}]);
    }
  }


  outputType(): string {
    return 'this._outputType';
  }

  render(outputData:object): void {

  }

  clear(): void {

  }

  response(data: object): void {
    //const message = data as MessageDTO<unknown>;
    //if(message.op === 'PARAGRAPH_OUTPUT') {
    //  const paragraphOutputMessage = new ParagraphOutputMessageImpl(message.data as ParagraphOutputDTO);
    //  const output = paragraphOutputMessage.toOutput();
    //  if(output.isStub()){
    //    this._htmlPlugin = this._htmlPluginStub;
    //    this._containerRefs.forEach(containerRef => containerRef.clear());
    //  }
    //  else{
    //    this._htmlPlugin = output.toHtmlPlugin();
    //    this._containerRefs.forEach(containerRef => containerRef.clear());
    //    if(!this._htmlPlugin.isStub()){
    //      this._containerRefs.forEach(containerRef => containerRef.createComponent(this._component, [{name:'plugin', value:this._htmlPlugin}]));
    //    }
    //  }
    //}
  }

  switcherButtons(): OutputSwitcherButton[] {
    return [];
  }
}
