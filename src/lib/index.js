export const concatAll = (arr) => [].concat.apply([], arr);

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const genNumberSeries = (from, to) => {
  return [...Array(to - from).keys()].map(i => i + from);
};

// Adds a sleep between each element of an array
export const debouncePromises = (urls, ms) => {
  return concatAll(urls.map(url => [
    () => Promise.resolve(url),
    () => sleep(ms)
  ]));
};