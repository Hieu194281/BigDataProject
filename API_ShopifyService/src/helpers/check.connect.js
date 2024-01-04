'use strict';

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECOND = 5000;

const countConnection = () => {
  const numConnection = mongoose.connection.length;
  console.log('Number of connections: ', numConnection);
  return numConnection;
};

const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connection.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // Example maximum number of connections based on number of cores
    const maxConnection = numCores * 5;

    console.log(`Active connection: ${numConnection}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

    if (numConnection > maxConnection) {
      console.log('Connection overload detected!');
    }
  }, _SECOND);
};

module.exports = {
  countConnection,
  checkOverload,
};
