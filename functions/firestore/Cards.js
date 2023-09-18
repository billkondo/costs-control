const { db } = require('.');

/** @type {Collection<UserCardDBData>} */
// @ts-ignore
const cardsCollection = db.collection('cards');

/**
 * @param {string} cardId
 * @returns {Promise<UserCardDBData>}
 */
const getCardById = async (cardId) => {
  const snapshot = await cardsCollection.where('id', '==', cardId).get();

  if (!snapshot.docs.length) {
    throw new Error('Card not found');
  }

  const card = snapshot.docs[0].data();

  return card;
};

module.exports = {
  getCardById,
};
