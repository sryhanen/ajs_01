import {HtmlPlugin} from './htmlPlugin';

export class HtmlPluginStub implements HtmlPlugin {
  unsanitizedHtmlString(): string {
    throw new Error('HtmlOutputStub: Method not implemented');
  }

  isStub(): boolean {
    return true;
  }
}
