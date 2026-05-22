import {OutputPlugin} from './plugins/outputPlugin';

export class FakeOutputPlugin implements OutputPlugin {
  isStub(): boolean {
    return false;
  };
  outputType(): string {
    return '';
  };
  render(anchorElement: HTMLElement): void {}
}
