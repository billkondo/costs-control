import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '..';

/**
 * @returns {FirestoreCollectionReference<UserCardDBData>}
 */
const getCardsCollection = () => {
  // @ts-ignore
  return collection(db, 'cards');
};

/**
 * @param {string} userId
 * @returns {Promise<UserCard[]>}
 */
const getAll = async (userId) => {
  const userCardsQuery = query(
    getCardsCollection(),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(userCardsQuery);

  return snapshot.docs.map((doc) => doc.data());
};

export default {
  getAll,
};
