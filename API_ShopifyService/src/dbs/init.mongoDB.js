'use strict';

const mongoose = require('mongoose');
const {
  db: { host, port, name },
} = require('./../configs/config.mongodb');

// const connectString = `mongodb://${host}:${port}/${name}`;
// const connectString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.wbgzw7i.mongodb.net/shopDev`;
const connectString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.xur9vj8.mongodb.net/big-data-project`;

// const connectString =
//   'mongodb+srv://tienanh1512:Aomg15122001@cluster0.wbgzw7i.mongodb.net/test';
console.log('Connecting to DB:', connectString);

const { countConnection } = require('./../helpers/check.connect');

class Database {
  constructor() {
    this.connect();
  }

  connect(type = 'mongodb') {
    // dev environment
    if (1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', {
        color: true,
      });
    }

    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then(async () => {
        console.log('Connected MongoDB successfully!');
        countConnection();
      })
      .catch(err => {
        console.log('Connect to MongoDB ERROR!', err);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
