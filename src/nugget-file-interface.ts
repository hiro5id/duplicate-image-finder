import { FileAttributesWithTypeAndHash } from './file-attributes-extractor.interface';

const readline = require('readline');
import fs from 'fs';
import { injectable } from './ioc-container/lib';

const { EOL } = require('os');

@injectable()
export class NuggetFileInterface {
  public async writeOrUpdate(_document: FileAttributesWithTypeAndHash, filePath: string): Promise<null> {
    return new Promise((resolve, reject) => {
      const { readStream, tempFile, writeStream, readInterface } = this.initFiles(filePath, reject);

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
          await this.renameFile(tempFile, filePath);
        } catch (err) {
          reject(`Error: Error ending write stream to ${tempFile} => ${(err as Error).message}`);
          return;
        }
        resolve(null);
      });

      readStream.on('error', error => reject(`Error: Error reading ${filePath} => ${error.message}`));
      writeStream.on('error', error => reject(`Error: Error writing to ${tempFile} => ${error.message}`));
    });
  }

  private initFiles(filePath: string, reject: (reason?: any) => void) {
    try {
      const readStream = fs.createReadStream(filePath, { encoding: 'utf-8', autoClose: true });

      const readInterface = readline.createInterface({
        input: readStream,
        //output: process.nu,
        console: false,
      });
      const tempFile = `${filePath}-copy`;
      const writeStream = fs.createWriteStream(tempFile, { encoding: 'utf-8', autoClose: true });

      return { readStream, tempFile, writeStream, readInterface };
    } catch (err) {
      reject(`Error: Error initializing files => ${(err as Error).message}`);
      throw new Error((err as Error).message);
    }
  }

  private async renameFile(oldPath: string, newPath: string): Promise<null> {
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
