import {
  collection,
  doc,
  getCountFromServer,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '..';
import getConstraints from './getConstraints';

/**
 * @returns {FirestoreCollectionReference<UserStoreDBData>}
 */
const getStoresCollection = () => {
  // @ts-ignore
  return collection(db, 'stores');
};

/**
 * @param {UserStore} userStore
 * @returns {Promise<UserStore>}
 */
export const addUserStore = async (userStore) => {
  const userStoreRef = doc(getStoresCollection());

  /** @type {UserStoreDBData} */
  const userStoreDBData = {
    ...userStore,
    id: userStoreRef.id,
  };

  await setDoc(userStoreRef, userStoreDBData);

  return userStoreDBData;
};

/**
 * @param {string} userId
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

  return query(
    getStoresCollection(),
    where('userId', '==', userId),
    ...constraints
  );
};
