// noinspection ES6PreferShortImport
import { injectable } from './ioc-container';
import { ImageMetadata } from './image-metadata.interface';
import { ImageMetaDataSaver } from './image-meta-data-saver';

@injectable()
export class ImageMetaDataMongoSaver implements ImageMetaDataSaver {
  constructor(private readonly db: any) {}
  async save(data: ImageMetadata) {
    //const collection = this.db.collection<ImageMetadata>(CollectionEnum.IMAGE_METADATA);
    //await collection.findOneAndUpdate({ binaryHash: data.binaryHash }, data, { upsert: true });
    console.log(`saving ${data.binaryHash}`);
  }
}
