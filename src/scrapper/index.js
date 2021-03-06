import cheerio from 'cheerio';
import req from 'cheerio-req';

const scrapeHTML = ($, opts) => {
  if (typeof $ === "string") {
    $ = cheerio.load($);
  }

  return opts.map(opt => {
    return {
      selector: opt.selector,
      target: opt.target,
      [opt.target]: $(opt.selector)
        .map(function () {
          return $(this).text();
        })
        .get()
    };
  });
};

const requestWebsite = (url, opts) =>
  new Promise((resolve, reject) => {
    console.log('url', url);
    req(url, (err, $) => {
      if (err) {
        console.log('err', err);
        return reject(err);
      }

      const data = scrapeHTML($, opts);
      resolve({
        url,
        data
      });
    });
  });

const scrapper = (url, opts = {}) =>
  new Promise(
    (resolve, reject) =>
      requestWebsite(url, opts)
        .then(resolve)
        .catch(reject)
  );

export default scrapper;