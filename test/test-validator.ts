import { isImageMetadata } from '../src';
import { expect } from 'chai';

describe('test validator', function () {
  it('is valid', function () {
    const result = isImageMetadata({ blah: true });
    expect(result).eql(false);
  });
});
