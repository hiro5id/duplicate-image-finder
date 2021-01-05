// noinspection ES6PreferShortImport
import { injectable } from './ioc-container';
import { ImageMetadata } from './image-metadata.interface';

@injectable()
export abstract class ImageMetaDataSaver {
  abstract save(data: ImageMetadata): void;
}
