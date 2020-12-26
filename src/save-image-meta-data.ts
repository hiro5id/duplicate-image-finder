import { injectable } from './ioc-container';
import { isImageMetadata } from './is-image-metadata';
import { ImageMetadata } from './image-metadata.interface';

@injectable()
export class SaveImageMetaData {
  public bar() {
    //todo: inject storage class implementation... example mongo/filesystem
    console.log('hi');
  }

  save(data: ImageMetadata) {
    if (isImageMetadata(data)) {
      //todo: implement saving of metadata.
    }
  }
}
