import os from 'os';
import path from 'path';

export function resolvePath(startPath: string) {
  let resolvedPath: string;
  if (startPath.startsWith('~')) {
    const homedir = os.homedir();
    resolvedPath = path.join(homedir, startPath.replace('~', ''));
  } else {
    resolvedPath = startPath;
  }

  resolvedPath = path.resolve(resolvedPath);
  resolvedPath = path.normalize(resolvedPath);

  return resolvedPath;
}
