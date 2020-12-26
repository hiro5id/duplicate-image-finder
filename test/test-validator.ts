import { ImageMetadata, isImageMetadata } from '../src';
import { expect } from 'chai';

describe('test validator', function () {
  it('is valid', function () {
    const testData: ImageMetadata = {
      pathInSearchDir: '',
      fileMimeType: 'application/ogg',
      fileName: '',
      fullPath: '',
      hash: {
        binaryHash: '',
        type: 'dhash',
        version: 'v1',
      },
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
      hash: {
        binaryHash: '',
        type: 'dhash',
        version: 'v1',
      },
    };
    const result = isImageMetadata(testData);
    expect(result).eql(false);
  });
});
