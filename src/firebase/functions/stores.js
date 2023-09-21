import { httpsCallable } from 'firebase/functions';
import { functions } from '..';

/** @type {FunctionCall<AddStoreRequest, AddStoreResponse>} */
const addStoreFunction = httpsCallable(functions, 'addStore');

/**
 * @param {Store} store
 * @returns {Promise<UserStore>}
 */
const add = async (store) => {
  const request = await addStoreFunction(store);
  const userStore = request.data;

  return userStore;
};

export default {
  add,
};
