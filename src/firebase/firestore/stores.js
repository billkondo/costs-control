import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '..';

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
