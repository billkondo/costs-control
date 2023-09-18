const { getFirestore } = require('firebase-admin/firestore');
const { app } = require('../firebase');

const db = getFirestore(app);

module.exports = {
  db,
};
