// Jan 1st 1970 00:00:00 am

const moment = require('moment');

// const date = new Date();
// const months = ['Jan', 'Feb']
// console.log(date.getMonth());

const date = moment();
date.add(1000, 'years').subtract(2, 'months');
console.log(date.format('MMM Do, YYYY'));


// both below gets the timestamp in ms
new Date().getTime();
const someTimestamp = moment().valueOf();

const createdAt = 555
const test = moment(createdAt);
console.log(test.format('h:mm a'));