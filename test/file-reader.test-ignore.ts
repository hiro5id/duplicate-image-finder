import { NuggetFileInterface } from '../src/nugget-file-interface';

xdescribe('reading file', function () {
  xit('read in a file', async function () {
    const f = new NuggetFileInterface();
    await f.writeOrUpdate({} as any, '/Users/roberto/clients_no_alternate.txt');
  });
});
