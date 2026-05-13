import {HtmlPlugin} from '../../../../objects/output/plugins/htmlPlugin/htmlPlugin';
import {render, screen} from '@testing-library/angular';
import {HtmlView} from './htmlView';
import {HtmlPluginImpl} from '../../../../objects/output/plugins/htmlPlugin/htmlPluginImpl';

describe('HtmlView', () => {
  const htmlString = '<h1>Some text data</h1>';
  let htmlPlugin: HtmlPlugin;
  beforeEach(async () => {
    htmlPlugin = new HtmlPluginImpl(htmlString);
    await render(HtmlView, {
      inputs:{
        plugin: htmlPlugin,
      }
    });
  });

  describe('Birth', () => {
    test('Should render', () => {
      expect(screen.getByRole('heading')).toBeDefined();
    });
  });
});
