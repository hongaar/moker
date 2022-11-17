import { TextFile } from "./TextFile.js";

export class JestConfig extends TextFile {
  constructor(public directory: string) {
    super(directory, "jest.config.js");
  }
}
