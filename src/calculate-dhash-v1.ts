import { Transform } from 'typed-streams';
import { FileAttributesWithType, FileAttributesWithTypeAndHash } from './file-attributes-extractor.interface';
import { Hash } from './hash.interface';
import { promisify } from 'util';
import * as fs from 'fs';
import * as os from 'os';
import path from 'path';
import crypto from 'crypto';
import { inject, injectable } from './ioc-container';

const dhash = require('dhash-image');
const convert = require('heic-convert');

@injectable()
export class CalculateDhashV1 extends Transform<FileAttributesWithType, FileAttributesWithTypeAndHash> {
  readonly name: string = CalculateDhashV1.name;

  constructor(@inject('objectMode') opts: {}) {
    super(opts);
  }

  _transformEx(chunk: FileAttributesWithType, encoding: BufferEncoding, callback: (error?: Error | null, data?: any) => void) {
    this.calculateHash(chunk, encoding)
      .then(() => callback())
      .catch(err => {
        console.log(`error in ${this.name}`, err);
        callback(err);
      });
  }

  private async calculateHash(chunk: FileAttributesWithType, encoding: BufferEncoding) {
    let filePathToCalcHash: string;
    let cleanupTmpFile: string | null = null;
    //we need to convert HEIC files to Jpg to be able to calculate the hash for it: https://www.npmjs.com/package/heic-convert
    if (chunk.fileMimeType?.toUpperCase().includes('HEIC')) {
      const inputBuffer = await promisify(fs.readFile)(chunk.fullPath);
      const outputBuffer = await convert({
        buffer: inputBuffer, // the HEIC file buffer
        format: 'PNG', // output format
      });
      const tmpdir = os.tmpdir();
      const randomString = crypto.randomBytes(5).toString('hex');
      const tmpFile = path.join(tmpdir, `dif-${randomString}-tmp.png`);
      await promisify(fs.writeFile)(tmpFile, outputBuffer);
      filePathToCalcHash = tmpFile;
      cleanupTmpFile = tmpFile;
    } else {
      filePathToCalcHash = chunk.fullPath;
    }

    const dhashv1 = await this.calcDhashv1(filePathToCalcHash);
    const dhashBinaryV1 = this.getBinaryString(dhashv1);

    const calculatedHash = {
      type: 'dhash',
      version: 'v1',
      binaryHash: dhashBinaryV1,
    } as Hash;

    this.push({ ...chunk, ...{ hash: calculatedHash } }, encoding);

    console.log('calculated signature: ', chunk.fileName, calculatedHash.binaryHash, chunk.pathInSearchDir);
    if (cleanupTmpFile != null) {
      void promisify(fs.unlink)(cleanupTmpFile);
    }
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
