import cheerio from 'cheerio';
import req from 'cheerio-req';

const scrapeHTML = ($, opts) =>
  Object.keys(opts)
    .map((key) =>
      $(opts[key])
        .map(function () {
          return $(this).text();
        })
        .get()
    );

const requestWebsite = (url, opts) =>
  new Promise((resolve, reject) => {
    req(url, (err, $) => {
      if (err) {
        return reject(err);
      }
      resolve(scrapeHTML($, opts));
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