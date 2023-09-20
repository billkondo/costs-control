import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '..';

/**
 * @returns {FirestoreCollectionReference<UserCardDBData>}
 */
const getCardsCollection = () => {
  // @ts-ignore
  return collection(db, 'cards');
};

/**
 * @param {UserCard} userCard
 * @returns {Promise<UserCard>}
 */
const add = async (userCard) => {
  const userCardRef = doc(getCardsCollection());

  /** @type {UserCardDBData} */
  const userCardDBData = {
    ...userCard,
    id: userCardRef.id,
  };

  await setDoc(userCardRef, userCardDBData);

  return userCardDBData;
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
  add,
  getAll,
};
