// noinspection ES6PreferShortImport
import { ImageMetadata } from './image-metadata.interface';
import { injectable } from './ioc-container/lib';

@injectable()
export abstract class ImageMetaDataSaver {
  abstract save(data: ImageMetadata): void;
}
