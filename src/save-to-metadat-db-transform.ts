// noinspection ES6PreferShortImport
import { Transform } from 'typed-streams';
import { FileAttributesWithTypeAndHash } from './file-attributes-extractor.interface';
import { SaveImageMetaData } from './save-image-meta-data';
import { inject, injectable } from './ioc-container/lib';

@injectable()
export class SaveToMetadatDbTransform extends Transform<FileAttributesWithTypeAndHash, FileAttributesWithTypeAndHash> {
  readonly name: string = SaveToMetadatDbTransform.name;

  constructor(@inject('objectMode') opts: {}, private readonly saveImageMetaData: SaveImageMetaData) {
    super(opts);
  }

  _transformEx(chunk: FileAttributesWithTypeAndHash, encoding: BufferEncoding, callback: (error?: Error | null, data?: any) => void) {
    this.save(chunk, encoding)
      .then(() => callback())
      .catch(err => {
        console.log(`error in ${this.name}`, err);
        callback(err);
      });
  }

  private async save(chunk: FileAttributesWithTypeAndHash, _encoding: BufferEncoding) {
    this.saveImageMetaData.save(chunk);
  }
}
