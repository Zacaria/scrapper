import async from 'async';
import scrapper from './scrapper';
import dbInit from './bin/dbInit';
import Scrap from './models/scrap';

import { keywords, ids, optsList } from '../mocks';
import { concatAll, sleep } from './lib';

dbInit();

const genIds = (from, to) => {
  return [...Array(to - from).keys()].map(i => i + from);
};

const urls = (ids, keyword) => {
  const { from, to } = ids;
  return concatAll(genIds(from, to)
    .map(id => `https://www.linkedin.com/edu/alumni?id=${id}&facets=&keyword=${keyword}&dateType=attended&startYear=&endYear=&incNoDates=true&start=0&count=10&filters=on`)
  );
};

const genFunctions = (urls) => {
  return concatAll(urls.map(url => [
    () => Promise.resolve(url),
    () => sleep(250)
  ]));
};

const saveScrap = (rawScrap) => {
  console.log('raw', rawScrap);
  return new Promise((resolve, reject) => {
    const scrap = new Scrap({
      url: rawScrap.url,
      data: rawScrap.data.map((e) => ({
        selector: e.selector,
        target: e.target,
        result: e[e.target]
      }))
    });

    scrap
      .save()
      .then(scrap => {
        // console.log('scra', scrap);
        resolve({
          data: scrap
        })
      })
      .catch(reject)
  });
};

const input = genFunctions(concatAll(keywords.map((keyword) => urls(ids, keyword))));

async.eachOfSeries(input,
  (item, key, cb) => {
    item().then(
      (url) => {
        if (!url) return cb();
        scrapper(url, optsList)
          .then(saveScrap)
          .then((scrap) => cb(null, scrap))
          .catch(cb);
      })
      .catch(cb);
  },
  (err, results) => {
    if (err) console.log('err', err);
    console.log('Done', results);
  });

// Promise.all(keywords.map((keyword) => urls(ids, keyword)))
//   .then((urls) => scrapper(url, optsList))
//   .then(saveScrap)
//   .catch(console.log);
