import { db } from '.';

/** @type {Collection<UserStoreDBData>} */
// @ts-ignore
const collection = db.collection('stores');

/**
 * @param {string} userId
 * @param {Store} store
 * @returns {Promise<UserStore>}
 */
const add = async (userId, store) => {
  const doc = collection.doc();

  /** @type {UserStoreDBData} */
  const userStoreDBData = {
    ...store,
    id: doc.id,
    userId,
  };

  await doc.set(userStoreDBData);

  return userStoreDBData;
};

const Stores = {
  add,
};

export default Stores;
