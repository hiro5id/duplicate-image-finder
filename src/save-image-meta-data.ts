// noinspection ES6PreferShortImport
import { isImageMetadata } from './is-image-metadata';
import { ImageMetadata } from './image-metadata.interface';
import { ValidationError } from './validation-error.interface';
// noinspection ES6PreferShortImport
import { injectable } from './ioc-container/lib';

@injectable()
export class SaveImageMetaData {
  constructor() {}

  save(data: ImageMetadata) {
    const validationError: ValidationError = {} as any;
    if (isImageMetadata(data, validationError)) {
      //todo: implement saving of metadata.
      //this.mongoSaveImageMetaData.save(data);
    } else {
      throw new Error(`validation errors while saving metadata ${validationError.errors.map(m => m.message).join(',')}`);
    }
  }
}
