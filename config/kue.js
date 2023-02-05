// configuration of que the create workers
const kue = require('kue');

const queue=  kue.createQueue();

module.exports= queue;