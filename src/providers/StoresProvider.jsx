import PropTypes from 'prop-types';
import { createContext } from 'react';
import { addUserStore } from '../firebase/firestore/stores';
import useAuthentication from './useAuthentication';

/**
 * @typedef {object} StoresState
 * @property {(store:Store) => Promise<void>} addStore
 */

/** @type {import("react").Context<StoresState>} */
export const StoresContext = createContext({
  addStore: async () => {},
});

/**
 * @param {import('react').PropsWithChildren} props
 */
const StoresProvider = (props) => {
  const { children } = props;
  const { authenticatedUserId } = useAuthentication();

  /**
   * @param {Store} store
   */
  const addStore = async (store) => {
    /** @type {UserStore} */
    const userStore = {
      ...store,
      id: null,
      userId: authenticatedUserId,
    };

    await addUserStore(userStore);
  };

  return (
    <StoresContext.Provider value={{ addStore }}>
      {children}
    </StoresContext.Provider>
  );
};

StoresProvider.propTypes = {
  children: PropTypes.node,
};

export default StoresProvider;
