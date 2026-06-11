import {Text} from './text';

export class TextImpl implements Text {
  private readonly _text:string;

  constructor(text:string) {
    this._text = text;
  }

  text():string{
    return this._text;
  }

  isStub(): boolean {
    return false;
  }
}
