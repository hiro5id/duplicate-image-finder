import { Transform } from 'typed-streams';
import { FileAttributesWithType } from './file-attributes-extractor.interface';

export class FilterOnlyImageFiles extends Transform<FileAttributesWithType, FileAttributesWithType> {
  readonly name: string = FilterOnlyImageFiles.name;

  constructor() {
    super({ objectMode: true });
  }

  _transformEx(chunk: FileAttributesWithType, encoding: BufferEncoding, callback: (error?: Error | null, data?: any) => void) {
    if (chunk?.fileMimeType != null && chunk.fileMimeType.startsWith('image')) {
      this.push(chunk, encoding);
    }
    callback();
  }
}
