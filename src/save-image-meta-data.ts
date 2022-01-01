// noinspection ES6PreferShortImport
import { injectable } from './ioc-container';
import { isImageMetadata } from './is-image-metadata';
import { ImageMetadata } from './image-metadata.interface';
import { ValidationError } from './validation-error.interface';

@injectable()
export class SaveImageMetaData {
  constructor() {}

  save(data: ImageMetadata) {
    const validationErrors: ValidationError[] = [];
    if (isImageMetadata(data, validationErrors)) {
      //todo: implement saving of metadata.
      //this.mongoSaveImageMetaData.save(data);
    } else {
      throw new Error(`validation errors while saving metadata ${validationErrors.map(m => m.message).join(',')}`);
    }
  }
}
