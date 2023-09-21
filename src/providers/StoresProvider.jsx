import PropTypes from 'prop-types';
import { createContext, useCallback, useState } from 'react';
import { getUserStores } from '../firebase/firestore/stores';
import FirebaseFunctions from '../firebase/functions';
import useAuthentication from './useAuthentication';

/**
 * @typedef {object} StoresState
 * @property {(store:Store) => Promise<void>} addStore
 * @property {() => Promise<void>} loadStores
 * @property {UserStore[]} stores
 */

/** @type {StoresState} */
const defaultStoresState = {
  stores: [],
  addStore: async () => {},
  loadStores: async () => {},
};

export const StoresContext = createContext(defaultStoresState);

/**
 * @param {import('react').PropsWithChildren} props
 */
const StoresProvider = (props) => {
  const { children } = props;
  const { authenticatedUserId } = useAuthentication();
  const [loaded, setLoaded] = useState(false);
  const [stores, setStores] = useState(/** @type {UserStore[]} */ ([]));

  const loadStores = useCallback(async () => {
    if (loaded) {
      return;
    }

    setLoaded(true);

    const stores = await getUserStores(authenticatedUserId);

    setStores(stores);
  }, [authenticatedUserId, loaded]);

  /**
   * @param {Store} store
   */
  const addStore = async (store) => {
    const userStore = await FirebaseFunctions.stores.add(store);

    await updateStoresWithNewStore(userStore);
  };

  /**
   * @param {UserStore} store
   */
  const updateStoresWithNewStore = async (store) => {
    await loadStores();

    setStores((stores) => [store].concat(stores));
  };

  return (
    <StoresContext.Provider value={{ addStore, loadStores, stores }}>
      {children}
    </StoresContext.Provider>
  );
};

StoresProvider.propTypes = {
  children: PropTypes.node,
};

export default StoresProvider;
