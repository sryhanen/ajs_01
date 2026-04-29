import {HtmlPlugin} from './htmlPlugin';

export class HtmlPluginImpl implements HtmlPlugin {
  private readonly _data:string;

  constructor(data:string) {
    this._data = data;
  }

  unsanitizedHtmlString(): string {
    return this._data;
  }

  isStub(): boolean {
    return false;
  }
}
