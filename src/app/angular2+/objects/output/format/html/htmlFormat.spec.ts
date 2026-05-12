import {HTMLFormat} from './htmlFormat';

describe('HTMLFormat', () => {
  let htmlFormat: HTMLFormat;

  beforeEach(() => {
    htmlFormat = new HTMLFormat();
  });

  describe('Birth', () => {
    it('Should be initialized', () => {
      expect(htmlFormat).toBeInstanceOf(HTMLFormat);
    });

    it('Should not have switcher buttons', () => {
      expect(htmlFormat.switcherButtons()).toEqual([]);
    });
  });
});
