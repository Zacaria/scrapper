import cheerio from 'cheerio';
import request from 'request';
import jsdom from 'jsdom';
import req from 'cheerio-req';

import path from 'path';
import childProcess from 'child_process';
import phantomjs from 'phantomjs';

const binPath = phantomjs.path;

const childArgs = [
  path.join(__dirname, 'phantom.js')
];

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
          console.log('len', item.innerText);
          return $(this).text();
        })
        .get()
    };
  });
};

const requestWebsite = (url, opts) =>
  new Promise((resolve, reject) => {
    console.log('url', url);
    // jsdom.env(
    //   url,
    //   ['https://code.jquery.com/jquery-3.1.1.min.js'],
    //   (err, window) => {
    //     if (err) {
    //       console.log('err', err);
    //       return reject(err);
    //     }
    //
    //     // childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
    //     //   if(err) console.log(stderr);
    //     //   console.log(stdout);
    //     // });
    //
    //     // console.log('body', window.document.querySelectorAll('.title a'));
    //
    //     const data = scrapeHTML(window.$, opts);
    //     console.log('data', opts, data);
    //     resolve({
    //       url,
    //       data
    //     });
    //   }
    // );
    req(url, (err, $, res, body) => {
      if (err) {
        console.log('err', err);
        return reject(err);
      }

      console.log($.html());

      const data = scrapeHTML($, opts);
      // console.log('data', opts, data)
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