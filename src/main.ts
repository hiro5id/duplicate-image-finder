import path from 'path';
import readdirp from 'readdirp';
import os from 'os';
import { Writable, Transform } from 'typed-streams';
import FileType from 'file-type';
import fs from 'fs';

/*
  writing cross platform paths:
  https://shapeshed.com/writing-cross-platform-node/

  cross platform file system tools:
  https://github.com/bcoe/awesome-cross-platform-nodejs#filesystem
 */
export class Main {
  async go() {
    const inputPath = '~/Pictures';
    const startPath = resolvePath(inputPath);
    await readdirp(startPath, { type: 'files' }).pipe(new FileProcessor()).toPromiseFinish();

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

export class FileAttributesExtractor extends Transform<readdirp.EntryInfo, string> {
  name: string = FileAttributesExtractor.name;
  constructor() {
    super({ objectMode: true });
  }

  // I should be able to implement _transformEx here.  But auto-complete does not offer that to me
  // I tried "implement members" command, but getting error "no members to implement found"
  // Looking at Transform class, there is clearly a _transformEx I should be able to implement here
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
