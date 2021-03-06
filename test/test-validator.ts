import { ImageMetadata, isImageMetadata } from '../src';
import { expect } from 'chai';

describe('test validator', function () {
  it('is valid', function () {
    const testData: ImageMetadata = {
      pathInSearchDir: '/some/path',
      fileMimeType: 'application/ogg',
      fileName: 'someFile.png',
      fullPath: '/the/full/path',
      binaryHash: '1011100011111100111111001111110001111100001011000001101111001011',
    };
    const result = isImageMetadata(testData);
    expect(result).eql(true);
  });

  it('is not valid', function () {
    const testData: any = {
      pathInSearchDir: '',
      fileMimeType: 1,
      fileName: '',
      fullPath: '',
      binaryHash: '',
    };
    const errors: any[] = [];
    const result = isImageMetadata(testData, errors);

    expect(result).eql(false);
    expect(errors).eql([
      {
        keyword: 'minLength',
        message: 'should NOT have fewer than 64 characters',
      },
      {
        keyword: 'type',
        message: 'should be string',
      },
      {
        keyword: 'enum',
        message: 'should be equal to one of the allowed values',
      },
      {
        keyword: 'minLength',
        message: 'should NOT have fewer than 1 characters',
      },
      {
        keyword: 'minLength',
        message: 'should NOT have fewer than 1 characters',
      },
      {
        keyword: 'minLength',
        message: 'should NOT have fewer than 1 characters',
      },
    ]);
  });
});
