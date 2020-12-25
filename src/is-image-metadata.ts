import { ImageMetadata } from './image-metadata.interface';
import Ajv from 'ajv';
import imageMetadataSchema from './schemas/image-metadata.json';

export function isImageMetadata(data: unknown): data is ImageMetadata {
  // todo: need to use a validator library here using ajv
  const ajv = new Ajv({ allErrors: true });
  const valid = ajv.validate(imageMetadataSchema, data);
  if (valid) {
    return true;
  } else {
    const errorText = ajv.errorsText() && ajv.errorsText().toLowerCase() !== 'no errors' ? ajv.errorsText() : '';
    console.log(errorText);
    return false;
  }
}
