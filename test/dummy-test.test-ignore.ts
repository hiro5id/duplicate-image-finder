const dhash = require('dhash-image');

function calcDhashv1(file: string) {
  return new Promise((resolve, reject) => {
    dhash(file, function (err: any, hash: any) {
      if (err != null) {
        reject(err);
      }
      resolve(hash);
    });
  });
}

function getBinaryString(result: any) {
  const binaryStringArray = [...result].map((m: number) => m.toString(2)).map(m => '0'.repeat(8 - m.length) + m);
  return binaryStringArray.join('');
}

xdescribe('dummy', function () {
  this.timeout(99999999);

  xit('dummy', async function () {
    const result = (await calcDhashv1('/Users/roberto/Pictures/mike2.png')) as any;
    const result2 = (await calcDhashv1('/Users/roberto/Pictures/mike3.png')) as any;
    const resultBinary = getBinaryString(result);
    console.log(resultBinary);
    const resultBinary2 = getBinaryString(result2);
    console.log(resultBinary2);

    const srcHash = new Hash(resultBinary);
    const distance = srcHash.getHammingDistance(new Hash(resultBinary2));
    console.log(distance);

    // const srcHash = new testhash.Hash('0111011001110000011110010101101100110011000100110101101000111000');

    // if (srcHash.getHammingDistance(destHash) <= 10) {
    //   console.log('Resembles');
    //   return;
    // }
  });
});

/**
 * this class was lifted from browser-image-hash package https://www.npmjs.com/package/browser-image-hash
 * all credit for this class goes to the author https://github.com/ytetsuro
 */
export class Hash {
  readonly rawHash: string;

  public constructor(rawHash: string) {
    if (rawHash.split('').find(row => row !== '1' && row !== '0')) {
      throw new TypeError('Not bits.');
    }

    this.rawHash = rawHash;
  }

  public getHammingDistance(hash: Hash) {
    if (this.rawHash.length !== hash.rawHash.length) {
      throw new TypeError('Not equal to hash length.');
    }

    const target = hash.rawHash.split('');
    const diff = this.rawHash.split('').filter((row, index) => row !== (target[index] || '0'));

    return diff.length;
  }

  public toString() {
    return this.calcuateHexadecimal(this.rawHash.split('').map(row => (row === '1' ? 1 : 0)));
  }

  private arrayChunk(array: (0 | 1)[], chunk: number) {
    return [...Array(Math.ceil(array.length / chunk)).keys()].map(index => array.slice(index * chunk, index * chunk + chunk));
  }

  private calcuateHexadecimal(binalyNumbers: (0 | 1)[]) {
    return this.arrayChunk(binalyNumbers, 4)
      .map(row => parseInt(row.join(''), 2).toString(16))
      .join('');
  }
}
