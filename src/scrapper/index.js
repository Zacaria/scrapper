import req from 'cheerio-req';

const scrapeHTML = ($, opts) =>
  opts.map(opt => ({
      selector: opt.selector,
      target: opt.target,
      [opt.target]: $(opt.selector)
        .map(function () {
          return $(this).text();
        })
        .get()
    })
  );
  // Object.keys(opts)
  //   .map((key) => ({
  //       [key]: $(opts[key])
  //         .map(function () {
  //           return $(this).text();
  //         })
  //         .get()
  //     })
  //   );

const requestWebsite = (url, opts) =>
  new Promise((resolve, reject) => {
    req(url, (err, $) => {
      if (err) {
        return reject(err);
      }
      resolve({
        url,
        data: scrapeHTML($, opts)
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