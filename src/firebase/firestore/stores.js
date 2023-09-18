import {
  collection,
  doc,
  getCountFromServer,
  getDocs,
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

  return query(
    getStoresCollection(),
    where('userId', '==', userId),
    ...constraints
  );
};
