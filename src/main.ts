import path from 'path';
import readdirp from 'readdirp';
import os from 'os';
import { Writable } from 'typed-streams';
import FileType from 'file-type';
import fs from 'fs';
import { ExtractFileAttributes } from './extract-file-attributes';
import { ExtractFileType } from './extract-file-type';
import { FilterOnlyImageFiles } from './filter-only-image-files';
import { CalculateDhashV1 } from './calculate-dhash-v1';
import { LoggerAdaptToConsole } from 'console-log-json';
import { compositionRoot } from './composition-root';
import { SaveToMetadatDbTransform } from './save-to-metadat-db-transform';

LoggerAdaptToConsole();
/*
  writing cross platform paths:
  https://shapeshed.com/writing-cross-platform-node/

  cross platform file system tools:
  https://github.com/bcoe/awesome-cross-platform-nodejs#filesystem
 */
export class Main {
  async go() {
    const container = compositionRoot();

    //todo: remove this
    container.get(SaveToMetadatDbTransform);

    const inputPath = '~/Pictures';
    const startPath = resolvePath(inputPath);
    // await readdirp(startPath, { type: 'files' }).pipe(new FileProcessor()).toPromiseFinish();
    await readdirp(startPath, { type: 'files' })
      .pipe(container.get(ExtractFileAttributes))
      .pipe(container.get(ExtractFileType))
      .pipe(container.get(FilterOnlyImageFiles))
      .pipe(container.get(CalculateDhashV1))
      // write metadata to metadataDB
      // do the output processing:
      // dump duplicate files to designated folder
      // dump extracted files to designated folder

      // NOTE: we need a writer that's why this pipeline won't finish
      // .pipe(new DummyWriter())
      .toPromiseFinish();

    // for await (const entry of readdirp(startPath,{type: 'files'})) {
    //   console.log(`${c.blue(entry.path)}`);
    // }
  }
}

function resolvePath(pathToCheck: string) {
  let resolvedPath: string;
  if (pathToCheck.startsWith('~')) {
    const homedir = os.homedir();
    resolvedPath = path.join(homedir, pathToCheck.replace('~', ''));
  } else {
    resolvedPath = pathToCheck;
  }

  resolvedPath = path.resolve(resolvedPath);
  resolvedPath = path.normalize(resolvedPath);

  return resolvedPath;
}

export class DummyWriter extends Writable<any> {
  readonly name: string = DummyWriter.name;
  constructor() {
    super({ objectMode: true });
  }

  _writeEx(chunk: any, _encoding: BufferEncoding, callback: (error?: Error | null) => void) {
    console.log(`dummy writer:`, chunk);
    callback();
  }
}

export class FileProcessor extends Writable<readdirp.EntryInfo> {
  readonly name: string = FileProcessor.name;
  constructor() {
    super({ objectMode: true });
  }
  private count = 0;

  _writeEx(chunk: readdirp.EntryInfo, _encoding: string, callback: (error?: Error | null) => void) {
    const stream = fs.createReadStream(chunk.fullPath);
    FileType.fromStream(stream)
      .then((res: any) => {
        if (res != null && res.mime.startsWith('image')) {
          this.count += 1;
          console.log(chunk.path, res.mime, this.count);
        }
        callback();
      })
      .catch(err => {
        callback(err);
      });
  }
}
