import scrapper from './scrapper';

const url = 'http://linkedin.com';
const urlError = 'http://havesomcode.io';
const url2 = 'http://www.havesomecode.io';
const urlList = 'https://www.havesomecode.io/resources/';

const opts2 = {
  title: 'h1#profile-title',
  resume: '.profile > p'
};

const optsList = {
  titles: 'h2'
};

scrapper(urlList, optsList)
  .then(console.log)
  .catch(console.log);
