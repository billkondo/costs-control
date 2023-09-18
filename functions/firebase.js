const { cert, initializeApp } = require('firebase-admin/app');
const serviceAccount = require('./serviceAccount.json');

const app = initializeApp({
  // @ts-ignore
  credential: cert(serviceAccount),
});

module.exports = {
  app,
};
