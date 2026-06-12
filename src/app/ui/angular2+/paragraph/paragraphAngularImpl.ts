import {Paragraph} from '../../../objects/paragraph/paragraph';
import {OutputContainer} from '../../../objects/output/container/outputContainer';
import {OutputContainerAngularImpl} from '../output/container/outputContainerAngularImpl';

export class ParagraphAngularImpl implements Paragraph{
  private readonly _paragraph:Paragraph;
  private readonly _outputContainer:OutputContainer;

  constructor(paragraph:Paragraph){
    this._paragraph = paragraph;
    this._outputContainer = new OutputContainerAngularImpl(this._paragraph.outputContainer());
  }

  id(): string {
    return this._paragraph.id();
  }

  outputContainer(): OutputContainer {
    return this._outputContainer;
  }

  print(): object {
    return this._paragraph.print();
  }

  request(data: object): void {
    this._paragraph.request(data);
  }

  response(data: object): void {
    this._outputContainer.response(data);
  }
}
