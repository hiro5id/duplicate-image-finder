import { expect } from 'chai';
import { ImageMetadata } from '../src/image-metadata.interface';
import { isImageMetadata } from '../src/is-image-metadata';
import { ValidationError } from '../src/validation-error.interface';

describe('test validator', function () {
  it('is valid', function () {
    const testData: ImageMetadata = {
      pathInSearchDir: '/some/path',
      fileMimeType: 'application/ogg',
      fileName: 'someFile.png',
      fullPath: '/the/full/path',
      binaryHash: '1012100011111100111111001111110001111100001011000001101111001011',
    };
    const errs: ValidationError = {} as any;
    isImageMetadata(testData, errs);
    console.log('errors', { errs: errs });
    //expect(result).eql(true);
  });

  it('is not valid', function () {
    const testData: any = {
      pathInSearchDir: '',
      fileMimeType: 1,
      fileName: '',
      fullPath: '',
      binaryHash: '',
    };
    const errors: ValidationError = {} as any;
    const result = isImageMetadata(testData, errors);

    expect(result).eql(false);
    expect(errors.errors).eql([
      {
        ruleName: 'minLength',
        property: '/binaryHash',
        message: 'must NOT have fewer than 64 characters',
      },
      {
        ruleName: 'type',
        property: '/fileMimeType',
        message: 'must be string',
      },
      {
        ruleName: 'enum',
        property: '/fileMimeType',
        message: 'must be equal to one of the allowed values',
      },
      {
        ruleName: 'minLength',
        property: '/fileName',
        message: 'must NOT have fewer than 1 characters',
      },
      {
        ruleName: 'minLength',
        property: '/fullPath',
        message: 'must NOT have fewer than 1 characters',
      },
      {
        ruleName: 'minLength',
        property: '/pathInSearchDir',
        message: 'must NOT have fewer than 1 characters',
      },
    ]);
  });
});
