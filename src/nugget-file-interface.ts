import { FileAttributesWithTypeAndHash } from './file-attributes-extractor.interface';

const readline = require('readline');
import fs from 'fs';
const { EOL } = require('os');

export class NuggetFileInterface {
  constructor(private readonly filePath: string) {}

  public async writeOrUpdate(_document: FileAttributesWithTypeAndHash): Promise<null> {
    const readStream = fs.createReadStream(this.filePath, { encoding: 'utf-8', autoClose: true });
    const tempFile = `${this.filePath}-copy`;
    const writeStream = fs.createWriteStream(tempFile, { encoding: 'utf-8', autoClose: true });

    const readInterface = readline.createInterface({
      input: readStream,
      output: process.stdout,
      console: false,
    });

    return new Promise((resolve, reject) => {
      readInterface.on('line', function (line: string) {
        try {
          writeStream.write(`${line}${EOL}`);
        } catch (err) {
          reject(`Error: Error writing stream to ${tempFile} => ${(err as Error).message}`);
          return;
        }
      });

      readInterface.on('close', async () => {
        try {
          writeStream.write(`END!!!!`);
          writeStream.end();
          await this.renameFile(tempFile, this.filePath);
        } catch (err) {
          reject(`Error: Error ending write stream to ${tempFile} => ${(err as Error).message}`);
          return;
        }
        resolve(null);
      });

      readStream.on('error', error => reject(`Error: Error reading ${this.filePath} => ${error.message}`));
      writeStream.on('error', error => reject(`Error: Error writing to ${tempFile} => ${error.message}`));
    });
  }

  async renameFile(oldPath: string, newPath: string): Promise<null> {
    return new Promise((resolve, reject) => {
      fs.rename(oldPath, newPath, error => {
        if (error) {
          reject(error);
        } else {
          resolve(null);
        }
      });
    });
  }
}
