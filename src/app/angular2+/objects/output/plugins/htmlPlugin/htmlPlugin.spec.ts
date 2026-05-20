import {HtmlPlugin} from './htmlPlugin';
import {HtmlPluginImpl} from './htmlPluginImpl';

describe('HtmlPlugin', () => {
  const data = 'data';
  let htmlPlugin: HtmlPlugin;
  beforeEach(() => {
    htmlPlugin = new HtmlPluginImpl(data);
  });

  describe('Birth', () => {
    it('Should be initialized', () => {
      expect(htmlPlugin).toBeInstanceOf(HtmlPluginImpl);
    });

    it('Should have unsanitizedHtmlString', () => {
      expect(htmlPlugin.unsanitizedHtmlString()).toEqual(data);
    });

    it('Should not be stub', () => {
      expect(htmlPlugin.isStub()).toBe(false);
    });
  });
});
