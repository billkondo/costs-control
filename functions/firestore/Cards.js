const { db } = require('.');

/** @type {Collection<UserCardDBData>} */
// @ts-ignore
const collection = db.collection('cards');

/**
 * @param {string} userId
 * @param {Card} card
 * @returns {Promise<UserCardDBData>}
 */
const add = async (userId, card) => {
  const doc = collection.doc();

  /** @type {UserCardDBData} */
  const userCardDBData = {
    ...card,
    id: doc.id,
    userId,
  };

  await doc.set(userCardDBData);

  return userCardDBData;
};

/**
 * @param {string} cardId
 * @returns {Promise<UserCardDBData>}
 */
const getCardById = async (cardId) => {
  const snapshot = await collection.where('id', '==', cardId).get();

  if (!snapshot.docs.length) {
    throw new Error('Card not found');
  }

  const card = snapshot.docs[0].data();

  return card;
};

module.exports = {
  add,
  getCardById,
};
