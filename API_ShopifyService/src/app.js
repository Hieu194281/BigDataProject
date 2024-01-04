require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

// Swagger Config
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3052',
      },
    ],
  },
  apis: [
    path.join(__dirname, 'routes/*.js'),
    // path.resolve(__dirname, 'routes/**/*.js'),
  ],
  // apis: [`src/routes/*.js`, `src/routes/**/*.js`],
};

const swaggerSpec = swaggerJSDoc(options);

const app = express();

// Swagger
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true }),
);

// Init Middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// Init DB
require('./dbs/init.mongoDB');
const { checkOverload } = require('./helpers/check.connect');
// checkOverload();

// KAFKA
// kafkaService.init();

// const { Kafka } = require('kafkajs');
// const clientId = 'mock-up-kafka-producer-client';
// const brokers = ['localhost:29092'];
// const topic = 'Test';
// const kafka = new Kafka({ clientId, brokers });
// const producer = kafka.producer();

// const produce = async () => {
//   await producer.connect();
//   await producer.send({
//     topic,
//     messages: [
//       { key: 'key1', value: 'hello world' },
//       { key: 'key2', value: 'hey hey!' },
//     ],
//   });
// };

// produce()
//   .then(() => {
//     console.log('produced successfully');
//   })
//   .catch(err => {
//     console.log('ERROR:::', err);
//   });
// END KAFKA

// Init Route
app.use('/', require('./routes'));

// Handling Router
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;

  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack: err.stack,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
