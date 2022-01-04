import { NuggetFileInterface } from '../src/nugget-file-interface';

xdescribe('reading file', function () {
  xit('read in a file', async function () {
    const f = new NuggetFileInterface('/Users/roberto/clients_no_alternate.txt');
    await f.writeOrUpdate({} as any);
  });
});
