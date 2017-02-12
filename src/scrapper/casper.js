const casperLib = require('casper');

const casper = casperLib.create({
  verbose: true,
  logLevel: 'debug',
  pageSettings: {
    loadImages: false,         // The WebPage instance used by Casper will
    loadPlugins: false,         // use these settings
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0'
  }
});

// print out all the messages in the headless browser context
casper.on('remote.message', function (msg) {
  this.echo('remote message caught: ' + msg);
});

// print out all the messages in the headless browser context
casper.on("page.error", function (msg, trace) {
  this.echo("Page Error: " + msg, "ERROR");
});

export const logIn = (user, pw) =>
  new Promise((resolve, reject) => {
    casper.start('https://www.linkedin.com', function () {
      this.fillSelectors('form.login-form', {
        'input[name="session_key"]': user,
        'input[name="session_password"]':  pw
      }, true);
    });

    casper.waitForUrl(/nhome/, () => {
      this.echo('Login Success');
      resolve(casper);
    });
  });

// TODO
function scrapHTML() {

}

export const scrap = (casperInstance, url, opts = {}) =>
  new Promise((resolve, reject) => {
    casperInstance.thenOpen(url);

    casperInstance.then(function () {
      const title = this.getElementInfo('title');
      this.echo(title.text);
      const companies = this.getElementsInfo('.alumni-facets-list .facet-wrapper:nth-child(2) .bucket-content .title');
      console.log(companies.map(e => e.text));
    });
  });

export const run = (casperInstance) =>
  new Promise((resolve, reject) => {
    casperInstance.run(function () {
      this.echo('done');
      this.exit();
      resolve();
    });
  });

export default casper;
