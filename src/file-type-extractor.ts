import { Transform } from 'typed-streams';
import { FileAttributes, FileAttributesWithType } from './file-attributes-extractor.interface';
import fs from 'fs';
import FileType from 'file-type';

export class FileTypeExtractor extends Transform<FileAttributes, FileAttributesWithType> {
  readonly name: string = FileTypeExtractor.name;

  constructor() {
    super({ objectMode: true });
  }

  _transformEx(chunk: FileAttributes, encoding: BufferEncoding, callback: (error?: Error | null, data?: any) => void) {
    this.getFileType(chunk, encoding)
      .then(() => callback())
      .catch(err => callback(err));
  }

  private async getFileType(chunk: FileAttributes, encoding: BufferEncoding) {
    const stream = fs.createReadStream(chunk.fullPath);
    const mimeType = await FileType.fromStream(stream);
    const fileAttributeWithType = { ...chunk, ...{ fileMimeType: mimeType?.mime } };
    this.push(fileAttributeWithType, encoding);
  }
}
