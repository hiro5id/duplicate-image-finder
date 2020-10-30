#!/usr/bin/env node

import { Main } from './main';

const main = new Main();
main
  .go()
  .then(() => {
    console.log('done');
  })
  .catch(err => console.error(`error ${err.message}`));
