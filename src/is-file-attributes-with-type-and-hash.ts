import { ValidationError } from './validation-error.interface';
import { FileAttributesWithTypeAndHash } from './file-attributes-extractor.interface';
import { getPropName } from './get-prop-name';
import interfaceSchemas from './schemas/interface-schemas.json';
import { validateDataWithSchema } from './validate-data-with-schema';

export function isFileAttributesWithTypeAndHash(data: unknown, errors?: ValidationError): data is FileAttributesWithTypeAndHash {
  const propname = getPropName(interfaceSchemas.definitions, interfaceSchemas.definitions.FileAttributesWithTypeAndHash);
  return validateDataWithSchema(data, interfaceSchemas.definitions.FileAttributesWithTypeAndHash, propname, errors);
}
