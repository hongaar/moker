import { EntriesFile } from "./EntriesFile.js";

export class GitIgnore extends EntriesFile {
  constructor(public directory: string) {
    super(directory, ".gitignore");
  }
}
