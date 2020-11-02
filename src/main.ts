import path from 'path';
import readdirp from 'readdirp';
import os from 'os';
import { Writable } from 'typed-streams';

/*
  writing cross platform paths:
  https://shapeshed.com/writing-cross-platform-node/

  cross platform file system tools:
  https://github.com/bcoe/awesome-cross-platform-nodejs#filesystem
 */
export class Main {
  async go() {
    const inputPath = '~/dev';
    const startPath = resolvePathCrossPlatform(inputPath);
    readdirp(startPath, { type: 'files' }).pipe(new FileProcessor());

    // for await (const entry of readdirp(startPath,{type: 'files'})) {
    //   console.log(`${c.blue(entry.path)}`);
    // }
  }
}

function resolvePathCrossPlatform(pathToCheck: string) {
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
    console.log(chunk.fullPath);
    callback();
  }
}
