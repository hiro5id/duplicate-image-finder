import { Transform } from 'typed-streams';
import { FileAttributes, FileAttributesWithType } from './file-attributes-extractor.interface';
import fs from 'fs';
import FileType from 'file-type';
import { inject, injectable } from './ioc-container/lib';

@injectable()
export class ExtractFileType extends Transform<FileAttributes, FileAttributesWithType> {
  readonly name: string = ExtractFileType.name;

  constructor(@inject('objectMode') opts: {}) {
    super(opts);
  }

  _transformEx(chunk: FileAttributes, encoding: BufferEncoding, callback: (error?: Error | null, data?: any) => void) {
    this.getFileType(chunk, encoding)
      .then(() => callback())
      .catch(err => {
        console.log(`error in ${this.name}`, err);
        callback(err);
      });
  }

  private async getFileType(chunk: FileAttributes, encoding: BufferEncoding) {
    const stream = fs.createReadStream(chunk.fullPath);
    const mimeType = await FileType.fromStream(stream);
    const fileAttributeWithType = { ...chunk, ...{ fileMimeType: mimeType?.mime } };
    this.push(fileAttributeWithType, encoding);
  }
}
