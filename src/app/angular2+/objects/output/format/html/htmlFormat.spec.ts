import {HTMLFormat} from './htmlFormat';
import {Channel} from '../../../channel/channel';
import {FakeChannel} from '../../../channel/fakeChannel';
import {ContainerRef} from '../../../containerRef/containerRef';
import {FakeContainerRef} from '../../../containerRef/fakeContainerRef';
import {ParagraphOutputDTO} from '../../../message/paragraphOutputMessage/paragraphOutputDTO';
import {MessageDTO} from '../../../message/messageDTO';
import {OutputType} from '../../outputType';

describe('HTMLFormat', () => {
  let channel:Channel;
  let htmlFormat: HTMLFormat;

  beforeEach(() => {
    channel = new FakeChannel();
    htmlFormat = new HTMLFormat(channel);
  });

  describe('Birth', () => {
    it('Should be initialized', () => {
      expect(htmlFormat).toBeInstanceOf(HTMLFormat);
    });

    it('Should not have switcher buttons', () => {
      expect(htmlFormat.switcherButtons()).toEqual([]);
    });

    it('Should request channel', () => {
      const request = {test:'test'};
      const channelSpy = vi.spyOn(channel, 'request');
      htmlFormat.request(request);
      expect(channelSpy).toHaveBeenCalledExactlyOnceWith(request);
    });
  });

  describe('Response', () => {
    let constainerRef:ContainerRef;
    let containerRefClearSpy;
    let containerRefCreateSpy;
    const htmlOutputData = '<h1>Test</h1>';
    let paragraphOutputMessage:MessageDTO<ParagraphOutputDTO>;
    beforeEach(() => {
      constainerRef = new FakeContainerRef();
      containerRefClearSpy = vi.spyOn(constainerRef, 'clear');
      containerRefCreateSpy = vi.spyOn(constainerRef, 'createComponent');
      htmlFormat.pushContainerRef(constainerRef);
      paragraphOutputMessage = {
        op:'PARAGRAPH_OUTPUT',
        data: {
          noteId: '',
          paragraphId: '',
          output: {
            data: htmlOutputData,
            type: OutputType.html
          }
        }
      };
    });

    it('Should clear and create container', () => {
      htmlFormat.response(paragraphOutputMessage);
      expect(containerRefClearSpy).toHaveBeenCalledTimes(1);
      expect(containerRefCreateSpy).toHaveBeenCalledTimes(1);
    });

    it('Should only clear container', () => {
      paragraphOutputMessage.data.output.type = 'angular';
      htmlFormat.response(paragraphOutputMessage);
      expect(containerRefClearSpy).toHaveBeenCalledTimes(1);
      expect(containerRefCreateSpy).toHaveBeenCalledTimes(0);
    });

    it('Should only clear container', () => {
      paragraphOutputMessage.data.output = undefined;
      htmlFormat.response(paragraphOutputMessage);
      expect(containerRefClearSpy).toHaveBeenCalledTimes(1);
      expect(containerRefCreateSpy).toHaveBeenCalledTimes(0);
    });

    it('Should not react', () => {
      paragraphOutputMessage.op = 'DEFAULT';
      htmlFormat.response(paragraphOutputMessage);
      expect(containerRefClearSpy).toHaveBeenCalledTimes(0);
      expect(containerRefCreateSpy).toHaveBeenCalledTimes(0);
    });
  });
});
