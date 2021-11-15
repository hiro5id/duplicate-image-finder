import { ImageMetadata } from './image-metadata.interface';
import Ajv from 'ajv';
import interfaceSchemas from './schemas/interface-schemas.json';
import { isArray } from './is-array';
import { getPropName } from './get-prop-name';
import { ValidationError } from './validation-error.interface';

export function isImageMetadata(data: unknown, errors?: ValidationError[]): data is ImageMetadata {
  let ajv = new Ajv({ allErrors: true }); // Ajv option allErrors is required
  require('ajv-errors')(ajv); // better errors

  // load validation schema
  ajv = ajv.addSchema(interfaceSchemas);
  const validate = ajv.compile(interfaceSchemas.definitions.ImageMetadata);

  // validate
  const valid = validate(data);

  // handle validation
  if (valid) {
    // everything OK
    return true;
  } else {
    // show validation errors
    const errMsg = `validation failed for ${getPropName(interfaceSchemas.definitions, interfaceSchemas.definitions.ImageMetadata)}`;
    if (isArray(validate.errors)) {
      const validationErrors = validate.errors.map(m => {
        return { keyword: m.keyword, dataPath: m.dataPath, message: m.message } as ValidationError;
      });
      console.error(errMsg, { errors: validationErrors });
      if (errors != null) errors.push(...validationErrors);
    } else {
      console.error(`${errMsg} but the failure errors could not be determined`);
    }
    return false;
  }
}
