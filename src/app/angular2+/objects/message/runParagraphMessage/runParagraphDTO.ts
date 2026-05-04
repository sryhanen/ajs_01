export interface RunParagraphDTO {
  id:string;
  paragraph: string;
  config:object;
  params:object;
}

export const RunParagraphDTOStub: RunParagraphDTO = {
  get id(): string {
    throw new Error('RunParagraphDTOStub: Property not defined');
  },
  get paragraph(): string {
    throw new Error('RunParagraphDTOStub: Property not defined');
  },
  get config(): object {
    throw new Error('RunParagraphDTOStub: Property not defined');
  },
  get params(): object {
    throw new Error('RunParagraphDTOStub: Property not defined');
  }
};
