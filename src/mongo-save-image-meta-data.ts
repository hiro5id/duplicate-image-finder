// noinspection ES6PreferShortImport
import { injectable } from './ioc-container';
import { ImageMetadata } from './image-metadata.interface';
import { ImageMetaDataSaver } from './image-meta-data-saver';
import { Db } from 'mongodb';
import { CollectionEnum } from './collection-enum';

@injectable()
export class ImageMetaDataMongoSaver implements ImageMetaDataSaver {
  constructor(private readonly db: Db) {}
  async save(data: ImageMetadata) {
    const collection = this.db.collection<ImageMetadata>(CollectionEnum.IMAGE_METADATA);
    await collection.findOneAndUpdate({ binaryHash: data.binaryHash }, data, { upsert: true });
    console.log(`saving ${data.binaryHash}`);
  }
}
