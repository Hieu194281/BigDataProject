const app = require('./src/app');
const {
  app: { port },
} = require('./src/configs/config.mongodb.js');

const server = app.listen(port, () => {
  console.log(`Server start with port ${port}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Exit server Express');
    process.exit();
  });
});
