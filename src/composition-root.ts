// noinspection ES6PreferShortImport
import { decorate, injectable, interfaces } from './ioc-container/lib';
import { CalculateDhashV1 } from './calculate-dhash-v1';
import NodeStream from 'stream';
import { FilterOnlyImageFiles } from './filter-only-image-files';
import { ExtractFileType } from './extract-file-type';
import { ExtractFileAttributes } from './extract-file-attributes';
import { SaveToMetadatDbTransform } from './save-to-metadat-db-transform';
import { SaveImageMetaData } from './save-image-meta-data';
import { createSingletonContainer } from './ioc-container/create-singleton-container';
import { NuggetFileWriter } from './nugget-file-writer';

// const databaseType: 'mongo' | 'filesystem' = 'mongo';

let containerCache: interfaces.Container | null = null;
export function compositionRoot(): interfaces.Container {
  if (containerCache == null) {
    containerCache = createSingletonContainer();

    //decorate 3rd party objects
    decorate(injectable(), NodeStream.Transform);

    // Inversify scope documentation: https://github.com/inversify/InversifyJS/blob/master/wiki/scope.md

    containerCache.bind('objectMode').toConstantValue({ objectMode: true });
    containerCache.bind(CalculateDhashV1).toSelf().inTransientScope(); //ensure new instance every time
    containerCache.bind(NuggetFileWriter).toSelf().inTransientScope(); //ensure new instance every time
    containerCache.bind(FilterOnlyImageFiles).toSelf().inTransientScope(); //ensure new instance every time
    containerCache.bind(ExtractFileType).toSelf().inTransientScope(); //ensure new instance every time
    containerCache.bind(ExtractFileAttributes).toSelf().inTransientScope(); //ensure new instance every time
    containerCache.bind(SaveToMetadatDbTransform).toSelf().inTransientScope(); //ensure new instance every time
    containerCache.bind(SaveImageMetaData).toSelf();
    // containerCache
    //   .bind(ImageMetaDataSaver)
    //   .to(ImageMetaDataMongoSaver)
    //   .when(() => {
    //     return databaseType == 'mongo';
    //   });
  }
  return containerCache;
}
