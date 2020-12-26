import { createContainer, decorate, injectable, interfaces } from './ioc-container';
import { CalculateDhashV1 } from './calculate-dhash-v1';
import NodeStream from 'stream';
import { FilterOnlyImageFiles } from './filter-only-image-files';
import { ExtractFileType } from './extract-file-type';
import { ExtractFileAttributes } from './extract-file-attributes';
import { SaveToMetadatDbTransform } from './save-to-metadat-db-transform';
import { SaveImageMetaData } from './save-image-meta-data';

let containerCache: interfaces.Container | null = null;
export function compositionRoot(): interfaces.Container {
  if (containerCache == null) {
    containerCache = createContainer();

    decorate(injectable(), NodeStream.Transform);

    containerCache.bind('objectMode').toConstantValue({ objectMode: true });
    containerCache.bind(CalculateDhashV1).toSelf().inTransientScope();
    containerCache.bind(FilterOnlyImageFiles).toSelf().inTransientScope();
    containerCache.bind(ExtractFileType).toSelf().inTransientScope();
    containerCache.bind(ExtractFileAttributes).toSelf().inTransientScope();
    containerCache.bind(SaveToMetadatDbTransform).toSelf().inTransientScope();
    containerCache.bind(SaveImageMetaData).toSelf();
  }
  return containerCache;
}
