import {OutputFormat} from '../outputFormat';
import {OutputSwitcherButton} from '../../switcher/button/outputSwitcherButton';
import {OutputType} from '../../outputType';
import {SafeJsonImpl} from '../../../safeJson/safeJsonImpl';
import {HtmlPluginImpl} from '../../plugins/htmlPlugin/htmlPluginImpl';
import {OutputPlugin} from '../../plugins/outputPlugin';

export class HTMLFormat implements OutputFormat{
  private readonly _switcherButtons: OutputSwitcherButton[];
  private readonly _outputType: string;

  constructor() {
    this._outputType = OutputType.html;
    this._switcherButtons = [];
  }

  plugin(paragraphOutputData: object): OutputPlugin {
    const safeParagraphOutputData = new SafeJsonImpl(paragraphOutputData);
    const outputData:string = safeParagraphOutputData.getProperty('data', 'string');
    return new HtmlPluginImpl(outputData);
  }

  outputType(): string {
    return this._outputType;
  }

  switcherButtons(): OutputSwitcherButton[] {
    return this._switcherButtons;
  }
}
