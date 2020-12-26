import { ImageMetadata } from './image-metadata.interface';
import Ajv from 'ajv';
import imageMetadataSchema from './schemas/interface-schemas.json';

export function isImageMetadata(data: unknown): data is ImageMetadata {
  const ajv = new Ajv({ allErrors: true });

  const validate = ajv.addSchema(imageMetadataSchema).compile<ImageMetadata>(imageMetadataSchema.definitions.ImageMetadata);

  const valid = validate(data);
  if (valid) {
    return true;
  } else {
    const errorText = ajv.errorsText() && ajv.errorsText().toLowerCase() !== 'no errors' ? ajv.errorsText() : '';
    console.error(errorText);
    return false;
  }
}
