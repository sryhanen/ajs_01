import {OutputFormat} from '../outputFormat';
import {ContainerRef} from '../../../containerRef/containerRef';
import {OutputSwitcherButton} from '../../switcher/button/outputSwitcherButton';
import {HtmlPlugin} from '../../plugins/htmlPlugin/htmlPlugin';
import {HtmlPluginStub} from '../../plugins/htmlPlugin/htmlPluginStub';
import {HtmlView} from '../../../../components/output/plugins/htmlView/htmlView';
import {OutputType} from '../../outputType';
import {SafeJsonImpl} from '../../../safeJson/safeJsonImpl';
import {HtmlPluginImpl} from '../../plugins/htmlPlugin/htmlPluginImpl';

export class HTMLFormat implements OutputFormat{
  private readonly _containerRefs:ContainerRef[];
  private readonly _pluginStub: HtmlPlugin;
  private _plugin: HtmlPlugin;
  private readonly _component: new () => HtmlView;
  private readonly _outputType: string;

  constructor() {
    this._outputType = OutputType.html;
    this._containerRefs = [];
    this._pluginStub = new HtmlPluginStub();
    this._plugin = this._pluginStub;
    this._component = HtmlView;
  }

  pushContainerRef(value: ContainerRef): void {
    this._containerRefs.push(value);
    if(!this._plugin.isStub()){
      value.createComponent(this._component, [{name:'plugin', value:this._plugin}]);
    }
  }

  outputType(): string {
    return this._outputType;
  }

  render(paragraphOutputData:object): void {
    const safeParagraphOutputData = new SafeJsonImpl(paragraphOutputData);
    const outputData:string = safeParagraphOutputData.getProperty('data', 'string');
    this._plugin = new HtmlPluginImpl(outputData);
    this._containerRefs.forEach(containerRef => {
      containerRef.createComponent(this._component, [{name:'plugin', value:this._plugin}]);
    });
  }

  clear(): void {
    this._plugin = this._pluginStub;
    this._containerRefs.forEach(containerRef => containerRef.clear());
  }

  switcherButtons(): OutputSwitcherButton[] {
    return [];
  }
}
