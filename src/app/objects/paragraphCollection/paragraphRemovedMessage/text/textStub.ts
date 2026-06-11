import {Text} from './text';

export class TextStub implements Text {
  text(): string {
    throw new Error('TextStub');
  }

  isStub(): boolean {
    return true;
  }
}
