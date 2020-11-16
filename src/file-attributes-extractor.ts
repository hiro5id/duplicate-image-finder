import { Transform } from 'typed-streams';
import readdirp from 'readdirp';
import { FileAttributes } from './file-attributes-extractor.interface';

export class FileAttributesExtractor extends Transform<readdirp.EntryInfo, FileAttributes> {
  name: string = FileAttributesExtractor.name;

  constructor() {
    super({ objectMode: true });
  }

  _transformEx(chunk: readdirp.EntryInfo, encoding: BufferEncoding, callback: (error?: Error | null, data?: any) => void) {
    this.buildAttributes(chunk, encoding)
      .then(() => callback())
      .catch(err => callback(err));
  }

  private async buildAttributes(chunk: readdirp.EntryInfo, encoding: BufferEncoding) {
    const fileAttributes: FileAttributes = {
      fullPath: chunk.fullPath,
      pathInSearchDir: chunk.path,
      fileName: chunk.dirent?.name || '',
    };

    // const dhashv1 = await calcDhashv1(fileAttributes.fullPath)
    // const dhashBinaryV1 = getBinaryString(dhashv1);
    // fileAttributes.hash.type = 'dhash'
    // fileAttributes.hash.version = 'v1'
    // fileAttributes.hash.binaryHash = dhashBinaryV1

    this.push(fileAttributes, encoding);
  }
}
