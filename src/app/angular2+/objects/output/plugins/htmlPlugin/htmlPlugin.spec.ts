import {HtmlPlugin} from './htmlPlugin';
import {HtmlPluginImpl} from './htmlPluginImpl';
import {SafeJsonImpl} from '../../../safeJson/safeJsonImpl';
import {HtmlOutputDTO} from './htmlOutputDTO/htmlOutputDTO';
import {OutputType} from '../../outputType';

describe('HtmlPlugin', () => {
  const data = 'data';
  const htmlOutput:HtmlOutputDTO = {
    data: data,
    type: OutputType.html,
  };
  let htmlPlugin: HtmlPlugin;
  beforeEach(() => {
    htmlPlugin = new HtmlPluginImpl(new SafeJsonImpl(htmlOutput));
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
