import PropTypes from 'prop-types';
import { createContext, useCallback, useMemo, useState } from 'react';
import { getUserStores } from '../firebase/firestore/stores';
import FirebaseFunctions from '../firebase/functions';
import useAuthentication from './useAuthentication';

/**
 * @typedef {object} StoresState
 * @property {UserStore[]} stores
 * @property {{ [storeId: string]: UserStore }} storesById
 * @property {(store:Store) => Promise<void>} addStore
 * @property {() => Promise<void>} loadStores
 */

/** @type {StoresState} */
const defaultStoresState = {
  stores: [],
  storesById: {},
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

  const storesById = useMemo(() => {
    /** @type {{ [storeId: string]: UserStore }} */
    const storesById = {};

    for (const store of stores) {
      const { id } = store;

      storesById[id] = store;
    }

    return storesById;
  }, [stores]);

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
    <StoresContext.Provider
      value={{ addStore, storesById, loadStores, stores }}
    >
      {children}
    </StoresContext.Provider>
  );
};

StoresProvider.propTypes = {
  children: PropTypes.node,
};

export default StoresProvider;
