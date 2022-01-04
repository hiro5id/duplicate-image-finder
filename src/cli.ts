#!/usr/bin/env node

import { Main } from './main';

const main = new Main();
main
  .go()
  .then(() => {
    console.log('done');
  })
  .catch(err => {
    const errMessage = typeof err == 'string' ? err : err?.message;
    console.error(`error => ${errMessage}`);
    process.exit(2);
  });
