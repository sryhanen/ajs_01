import Stubable from '../../../../../shared/interfaces/stubable';

export interface HtmlPlugin extends Stubable {
  unsanitizedHtmlString(): string;
}
