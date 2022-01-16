import { ImageMetadata } from './image-metadata.interface';
import interfaceSchemas from './schemas/interface-schemas.json';
import { getPropName } from './get-prop-name';
import { ValidationError } from './validation-error.interface';
import { validateDataWithSchema } from './validate-data-with-schema';

export function isImageMetadata(data: unknown, errors?: ValidationError): data is ImageMetadata {
  return validateDataWithSchema(data, interfaceSchemas.definitions.ImageMetadata, getPropName(interfaceSchemas.definitions, interfaceSchemas.definitions.ImageMetadata), errors);
}
