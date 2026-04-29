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
  private readonly _htmlOutputStub: HtmlPlugin;
  private _htmlOutput: HtmlPlugin;
  private readonly _component: new () => HtmlView;

  constructor(channel:Channel) {
    this._channel = channel;
    this._containerRefs = [];
    this._htmlOutputStub = new HtmlPluginStub();
    this._htmlOutput = this._htmlOutputStub;
    this._component = HtmlView;
  }

  pushContainerRef(value: ContainerRef): void {
    this._containerRefs.push(value);
  }

  request(data: object): void {
    this._channel.request(data);
  }

  response(data: object): void {
    const message = data as MessageDTO<unknown>;
    if(message.op === 'PARAGRAPH_OUTPUT') {
      const paragraphOutputMessage = new ParagraphOutputMessageImpl(message.data as ParagraphOutputDTO);
      const output = paragraphOutputMessage.toOutput();
      if(output.isStub()){
        this._htmlOutput = this._htmlOutputStub;
        this._containerRefs.forEach(containerRef => containerRef.clear());
      }
      else{
        this._htmlOutput = output.toHtmlOutput();
        this._containerRefs.forEach(containerRef => containerRef.clear());
        if(!this._htmlOutput.isStub()){
          this._containerRefs.forEach(containerRef => containerRef.createComponent(this._component, [{name:'htmlOutput', value:this._htmlOutput}]));
        }
      }
    }
  }

  switcherButtons(): OutputSwitcherButton[] {
    return [];
  }
}
