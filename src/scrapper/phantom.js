import cheerio from 'cheerio';
import request from 'request';
import jsdom from 'jsdom';
import req from 'cheerio-req';
const page = require('webpage').create();

page.open('http://www.httpuseragent.org', function(status) {
  if (status !== 'success') {
    console.log('Unable to access network');
  } else {
    var ua = page.evaluate(function() {
      return document.getElementById('myagent').textContent;
    });
    console.log(ua);
  }
  phantom.exit();
});

const scrapeHTML = ($, opts) => {
  if (typeof $ === "string") {
    $ = cheerio.load($);
  }

  return opts.map(opt => {
    console.log('opt', opt);

    const data = $.document.querySelectorAll(opt.selector);
    console.log(data, data.length, '_________________');

    return {
      selector: opt.selector,
      target: opt.target,
      [opt.target]: data
        .forEach(function (item) {
          console.log('len', item.innerText);
          return item.innerText;
        })
    };
  });
};

const requestWebsite = (url, opts) =>
  new Promise((resolve, reject) => {
    console.log('url', url);
    jsdom.env(
      url,
      ["http://code.jquery.com/jquery.js"],
      (err, window) => {
        if (err) {
          console.log('err', err);
          return reject(err);
        }

        const t = window.document.querySelectorAll('.title a');

        // t.map(i => console.log(i.text()));

        console.log('body', window.document.querySelectorAll('.title a'));

        const data = scrapeHTML(window, opts);
        console.log('data', opts, data);
        resolve({
          url,
          data
        });
      }
    );
    // request(url, (err, res, body) => {
    //   if (err) {
    //     console.log('err', err);
    //     return reject(err);
    //   }
    //
    //   const data = scrapeHTML(body, opts);
    //   console.log('data', opts, data)
    //   resolve({
    //     url,
    //     data
    //   });
    // });
  });

const scrapper = (url, opts = {}) =>
  new Promise(
    (resolve, reject) =>
      requestWebsite(url, opts)
        .then(resolve)
        .catch(reject)
  );


export default scrapper;