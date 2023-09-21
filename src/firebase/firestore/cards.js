import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '..';

/** @type {FirestoreCollectionReference<UserCardDBData>} */
// @ts-ignore
const cardsCollection = collection(db, 'cards');

/**
 * @param {string} userId
 * @returns {Promise<UserCard[]>}
 */
const getAll = async (userId) => {
  const userCardsQuery = query(cardsCollection, where('userId', '==', userId));

  const snapshot = await getDocs(userCardsQuery);

  return snapshot.docs.map((doc) => doc.data());
};

export default {
  getAll,
};
