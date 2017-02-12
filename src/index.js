import async from 'async';
import scrapper from './scrapper';
import dbInit from './bin/dbInit';
import Scrap from './models/scrap';

import { keywords, ids, optsList } from '../mocks';
import { concatAll, genNumberSeries, debouncePromises } from './lib';

dbInit();

const urls = (ids, keyword) => {
  const { from, to } = ids;
  return concatAll(genNumberSeries(from, to)
    .map(id => `https://www.linkedin.com/edu/alumni?id=${id}&facets=G.fr:5227&keyword=${keyword}&dateType=attended&startYear=&endYear=&incNoDates=true&start=0&count=10&filters=on`)
  );
};

const saveScrap = (rawScrap) => {
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
        resolve({
          data: scrap
        })
      })
      .catch(reject)
  });
};

const input = debouncePromises(concatAll(keywords.map((keyword) => urls(ids, keyword))));

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
