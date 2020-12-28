import { ImageMetadata } from './image-metadata.interface';
import Ajv from 'ajv';
import imageMetadataSchema from './schemas/interface-schemas.json';
import { isArray } from './is-array';
import { getPropName } from './get-prop-name';
import { ValidationError } from './validation-error.interface';

export function isImageMetadata(data: unknown, errors?: ValidationError[]): data is ImageMetadata {
  let ajv = new Ajv({ allErrors: true });
  // Ajv option allErrors is required
  require('ajv-errors')(ajv);

  ajv = ajv.addSchema(imageMetadataSchema);
  const validate = ajv.compile(imageMetadataSchema.definitions.ImageMetadata);

  const valid = validate(data);
  if (valid) {
    return true;
  } else {
    const errMsg = `validation failed for ${getPropName(imageMetadataSchema.definitions, imageMetadataSchema.definitions.ImageMetadata)}`;
    if (isArray(validate.errors)) {
      const validationErrors = validate.errors.map(m => {
        return { keyword: m.keyword, message: m.message } as ValidationError;
      });
      console.error(errMsg, { errors: validationErrors });
      if (errors != null) errors.push(...validationErrors);
    } else {
      console.error(`${errMsg} but the failure errors could not be determined`);
    }
    return false;
  }
}
