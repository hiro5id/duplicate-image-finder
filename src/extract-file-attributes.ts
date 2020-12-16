import { Transform } from 'typed-streams';
import readdirp from 'readdirp';
import { FileAttributes } from './file-attributes-extractor.interface';
import { inject, injectable } from './ioc-container';

@injectable()
export class ExtractFileAttributes extends Transform<readdirp.EntryInfo, FileAttributes> {
  name: string = ExtractFileAttributes.name;

  constructor(@inject('objectMode') opts: {}) {
    super(opts);
  }

  _transformEx(chunk: readdirp.EntryInfo, encoding: BufferEncoding, callback: (error?: Error | null, data?: any) => void) {
    this.buildAttributes(chunk, encoding)
      .then(() => callback())
      .catch(err => {
        console.log(`error in ${this.name}`, err);
        callback(err);
      });
  }

  private count = 0;

  private async buildAttributes(chunk: readdirp.EntryInfo, encoding: BufferEncoding) {
    const fileAttributes: FileAttributes = {
      fullPath: chunk.fullPath,
      pathInSearchDir: chunk.path,
      fileName: chunk.dirent?.name || '',
    };

    this.count += 1;
    console.log(`file count ${this.count}`, fileAttributes.fileName);

    // const dhashv1 = await calcDhashv1(fileAttributes.fullPath)
    // const dhashBinaryV1 = getBinaryString(dhashv1);
    // fileAttributes.hash.type = 'dhash'
    // fileAttributes.hash.version = 'v1'
    // fileAttributes.hash.binaryHash = dhashBinaryV1

    this.push(fileAttributes, encoding);
  }
}
