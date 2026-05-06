import {HtmlPlugin} from '../../../../objects/output/plugins/htmlPlugin/htmlPlugin';
import {render, screen} from '@testing-library/angular';
import {HtmlView} from './htmlView';
import {HtmlPluginImpl} from '../../../../objects/output/plugins/htmlPlugin/htmlPluginImpl';
import {HtmlOutputDTO} from '../../../../objects/output/plugins/htmlPlugin/htmlOutputDTO/htmlOutputDTO';
import {OutputType} from '../../../../objects/output/outputType';
import {SafeJsonImpl} from '../../../../objects/safeJson/safeJsonImpl';

describe('HtmlView', () => {
  const htmlString = '<h1>Some text data</h1>';
  const output: HtmlOutputDTO = {
    data:htmlString,
    type:OutputType.html,
  };
  let htmlPlugin: HtmlPlugin;
  beforeEach(async () => {
    htmlPlugin = new HtmlPluginImpl(new SafeJsonImpl(output));
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
