import { FileAttributesWithTypeAndHash } from './file-attributes-extractor.interface';

const readline = require('readline');
import fs, { WriteStream } from 'fs';
// noinspection ES6PreferShortImport
import { injectable } from './ioc-container/lib';

const { EOL } = require('os');

@injectable()
export class NuggetFileInterface {
  public async writeOrUpdate(inputDocuments: FileAttributesWithTypeAndHash[], filePath: string): Promise<null> {
    if (inputDocuments == null) {
      throw new Error(`inputDocuments must be defined`);
    }
    return new Promise((resolve, reject) => {
      const { readStream, tempFile, writeStream, readInterface } = NuggetFileInterface.initFiles(filePath, reject);

      readInterface.on('line', (line: string) => {
        // noinspection ExceptionCaughtLocallyJS
        try {
          // replace line if document matches
          const matchedDocuments = inputDocuments.filter(docToWrite => {
            if (NuggetFileInterface.documentMatches(docToWrite, line)) {
              return docToWrite;
            }
          });

          if (matchedDocuments.length > 1) {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error(`unexpected to match more than one document for ${JSON.stringify(matchedDocuments[0])}`);
          } else if (matchedDocuments.length == 1) {
            //replace the line because it matched
            this.writeDocuments([matchedDocuments[0]], writeStream);
            //then remove from documents array so that it is not written at the end of file
            const indexToRemove = inputDocuments.indexOf(matchedDocuments[0]);
            inputDocuments.splice(indexToRemove, 1);
          } else {
            // just copy whatever was in source
            writeStream.write(`${line}${EOL}`);
          }
        } catch (err) {
          reject(`Error: Error writing stream to ${tempFile} => ${(err as Error).message}`);
          return;
        }
      });

      readInterface.on('close', async () => {
        try {
          // write any remaining documents to end of file
          this.writeDocuments(inputDocuments, writeStream);
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

  private static documentMatches(docToWrite: FileAttributesWithTypeAndHash, line: string): boolean {
    return line.includes(docToWrite.fullPath);
  }

  private writeDocuments(document: FileAttributesWithTypeAndHash[], writeStream: WriteStream) {
    document.forEach(doc => {
      const textDocument = JSON.stringify(doc);
      writeStream.write(`${textDocument}${EOL}`);
    });
  }

  private static initFiles(filePath: string, reject: (reason?: any) => void) {
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
