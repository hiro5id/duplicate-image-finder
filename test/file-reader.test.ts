import { NuggetFileWriter } from '../src/nugget-file-writer';

describe('reading file', function () {
  it('read in a file', async function () {
    const f = new NuggetFileWriter();
    await f.writeOrUpdate([{}] as any, '/Users/roberto/clients_no_alternate.txt');
  });
});
