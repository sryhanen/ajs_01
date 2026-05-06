import {HtmlPlugin} from './htmlPlugin';
import {SafeJson} from '../../../safeJson/safeJson';
import {HtmlOutputDTOStub} from './htmlOutputDTO/htmlOutputDTOStub';
import {HtmlOutputDTO} from './htmlOutputDTO/htmlOutputDTO';

export class HtmlPluginImpl implements HtmlPlugin {
  private readonly _safeJson:SafeJson<HtmlOutputDTO>;

  constructor(safeJson:SafeJson<HtmlOutputDTO>) {
    this._safeJson = safeJson;
  }

  unsanitizedHtmlString(): string {
    const data = this._safeJson.deserialized(HtmlOutputDTOStub);
    return data.data;
  }

  isStub(): boolean {
    return false;
  }
}
