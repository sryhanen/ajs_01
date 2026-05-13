
import {OutputPlugin} from '../outputPlugin';

export class HtmlPluginImpl implements OutputPlugin {
  private readonly _data:string;

  constructor(data:string) {
    this._data = data;
  }

  render(anchorElement: HTMLElement):void {
    anchorElement.innerHTML = this._data;
  }

  isStub(): boolean {
    return false;
  }
}
