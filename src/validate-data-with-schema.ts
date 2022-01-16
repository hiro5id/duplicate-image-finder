import Ajv, { Schema, JSONSchemaType } from 'ajv';
import { ValidationError, ValidationErrorDetail } from './validation-error.interface';
import interfaceSchemas from './schemas/interface-schemas.json';
import { isArray } from './is-array';
let ajv = new Ajv({ allErrors: true }); // Ajv option allErrors is required
require('ajv-errors')(ajv); // better errors

export function validateDataWithSchema<T = unknown>(data: any, schema: Schema | JSONSchemaType<T>, propertyName: string, errorsOutput?: ValidationError): boolean {
  if (errorsOutput != null) {
    (errorsOutput as ValidationError).errors = [];
    (errorsOutput as ValidationError).typeName = propertyName;
  }

  // load validation schema
  ajv = ajv.addSchema(interfaceSchemas);
  const validate = ajv.compile(schema);

  // validate
  const valid = validate(data);

  // handle validation
  if (valid) {
    // everything OK
    return true;
  } else {
    // show validation errors
    const errMsg = `validation failed for ${propertyName}`;
    if (isArray(validate.errors)) {
      const validationErrors = validate.errors.map(m => {
        return { ruleName: m.keyword, property: m.instancePath, message: m.message } as ValidationErrorDetail;
      });
      if (errorsOutput != null) errorsOutput.errors.push(...validationErrors);
    } else {
      const message = `validation error for ${errMsg} but the failure errors could not be determined`;
      console.error(message);
      if (errorsOutput != null)
        errorsOutput.errors.push({
          message: message,
          property: 'all',
          ruleName: 'all',
        });
    }
    return false;
  }
}
