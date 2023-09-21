import {
  collection,
  getCountFromServer,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '..';
import getConstraints from './getConstraints';

/** @type {FirestoreCollectionReference<UserStoreDBData>} */
// @ts-ignore
const storesCollection = collection(db, 'stores');

/**
 * @param {string} userId
 * @returns {Promise<UserStore[]>}
 */
export const getUserStores = async (userId) => {
  const query = getUserStoresBaseQuery({ userId });
  const snapshot = await getDocs(query);

  return snapshot.docs.map((doc) => {
    const userStore = doc.data();

    return userStore;
  });
};

/**
 * @param {string} userId
 * @returns {Promise<number>}
 */
export const getUserStoresTotal = async (userId) => {
  const query = getUserStoresBaseQuery({ userId });
  const snapshot = await getCountFromServer(query);

  return snapshot.data().count;
};

/**
 * @param {QueryParams<UserStore>} params
 * @returns {FirestoreQuery<UserStore>}
 */
export const getUserStoresBaseQuery = (params) => {
  const { userId } = params;

  const constraints = getConstraints(params);

  return query(storesCollection, where('userId', '==', userId), ...constraints);
};
