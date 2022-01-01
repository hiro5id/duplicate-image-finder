import { Transform } from 'typed-streams';
import { FileAttributesWithType } from './file-attributes-extractor.interface';
import { inject, injectable } from './ioc-container';

@injectable()
export class FilterOnlyImageFiles extends Transform<FileAttributesWithType, FileAttributesWithType> {
  readonly name: string = FilterOnlyImageFiles.name;

  constructor(@inject('objectMode') opts: {}) {
    super(opts);
  }

  _transformEx(chunk: FileAttributesWithType, encoding: BufferEncoding, callback: (error?: Error | null, data?: any) => void) {
    try {
      if (chunk?.fileMimeType != null && chunk.fileMimeType.startsWith('image')) {
        this.push(chunk, encoding);
      }
      callback();
    } catch (err: any) {
      console.log(`error in ${this.name}`, err);
      callback(err);
    }
  }
}
