// noinspection ES6PreferShortImport
import { injectable } from './ioc-container';
import { isImageMetadata } from './is-image-metadata';
import { ImageMetadata } from './image-metadata.interface';
import { ValidationError } from './validation-error.interface';
import { ImageMetaDataSaver } from './image-meta-data-saver';

@injectable()
export class SaveImageMetaData {
  constructor(private readonly mongoSaveImageMetaData: ImageMetaDataSaver) {}

  save(data: ImageMetadata) {
    const validationErrors: ValidationError[] = [];
    if (isImageMetadata(data, validationErrors)) {
      //todo: implement saving of metadata.
      this.mongoSaveImageMetaData.save(data);
    } else {
      throw new Error(`validation errors while saving metadata ${validationErrors.map(m => m.message).join(',')}`);
    }
  }
}
