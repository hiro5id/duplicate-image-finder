// noinspection ES6PreferShortImport
import { injectable } from './ioc-container';
import { ImageMetadata } from './image-metadata.interface';
import { ImageMetaDataSaver } from './image-meta-data-saver';

@injectable()
export class ImageMetaDataMongoSaver implements ImageMetaDataSaver {
  save(data: ImageMetadata) {
    console.log(`saving ${data.hash.binaryHash}`);
  }
}
