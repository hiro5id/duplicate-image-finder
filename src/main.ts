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

export class FileProcessor extends Writable<readdirp.EntryInfo> {
  readonly name: string = FileProcessor.name;
  constructor() {
    super({ objectMode: true });
  }

  _writeEx(chunk: readdirp.EntryInfo, _encoding: string, callback: (error?: Error | null) => void) {
    const stream = fs.createReadStream(chunk.fullPath);
    FileType.fromStream(stream)
      .then((res: any) => {
        if (res != null && res.mime.startsWith('image')) {
          console.log(chunk.path, ' ', res.mime);
        }
        callback();
      })
      .catch(err => {
        callback(err);
      });
  }
}
