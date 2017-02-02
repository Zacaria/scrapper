import scrapper from './scrapper';
import dbInit from './dbInit';
import Scrap from './models/scrap';

dbInit();

const url = 'http://linkedin.com';
const urlError = 'http://havesomcode.io';
const url2 = 'http://www.havesomecode.io';
const urlList = 'https://www.havesomecode.io/resources/';

const optsList = [
  {
    target: 'titles',
    selector: 'h2'
  },
  {
    target: 'texts',
    selector: 'p'
  }
];

const saveScrap = (rawScrap) => {
  const scrap = new Scrap({
    url: rawScrap.url,
    data: rawScrap.data.map((e) => {
      console.log(e);
      return {
        selector: e.selector,
        target: e.target,
        result: e[e.target]
      }
    })
  });

  scrap.save()
    .then(() => console.log('coucou'));
};

scrapper(urlList, optsList)
  .then(saveScrap)
  .catch(console.log);
