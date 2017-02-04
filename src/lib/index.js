export const concatAll = (arr) => [].concat.apply([], arr);

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));