import { Transform } from 'typed-streams';
import { FileAttributesWithType, FileAttributesWithTypeAndHash } from './file-attributes-extractor.interface';
import { Hash } from './hash.interface';
const dhash = require('dhash-image');

export class FileDhashCalculatorV1 extends Transform<FileAttributesWithType, FileAttributesWithTypeAndHash> {
  readonly name: string = FileDhashCalculatorV1.name;

  constructor() {
    super({ objectMode: true });
  }

  _transformEx(chunk: FileAttributesWithType, encoding: BufferEncoding, callback: (error?: Error | null, data?: any) => void) {
    this.calculateHash(chunk, encoding)
      .then(() => callback())
      .catch(err => callback(err));
  }

  private async calculateHash(chunk: FileAttributesWithType, encoding: BufferEncoding) {
    //todo: we need to convert HEIC files to Jpg to be able to calculate the hash for it: https://www.npmjs.com/package/heic-convert
    const dhashv1 = await this.calcDhashv1(chunk.fullPath);
    const dhashBinaryV1 = this.getBinaryString(dhashv1);

    const calculatedHash = {
      type: 'dhash',
      version: 'v1',
      binaryHash: dhashBinaryV1,
    } as Hash;

    this.push({ ...chunk, ...{ hash: calculatedHash } }, encoding);
  }

  private calcDhashv1(file: string) {
    return new Promise((resolve, reject) => {
      dhash(file, function (err: any, hash: any) {
        if (err != null) {
          reject(err);
        }
        resolve(hash);
      });
    });
  }

  private getBinaryString(result: any) {
    const binaryStringArray = [...result].map((m: number) => m.toString(2)).map(m => '0'.repeat(8 - m.length) + m);
    return binaryStringArray.join('');
  }
}
