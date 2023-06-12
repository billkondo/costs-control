import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';
import * as FirebaseAuth from '../firebase/auth';

/** @typedef {object} AuthenticationState
 * @property {boolean} authenticated
 * @property {string} authenticatedUserId
 * @property {(email: string, passowrd: string) => Promise<void>} loginWithEmailAndPassword
 */

/** @type {import('react').Context<AuthenticationState>} */
export const AuthenticationContext = createContext({
  authenticated: false,
  loginWithEmailAndPassword: async () => {},
  authenticatedUserId: null,
});

/** @type {string | null} */
const defaultAuthenticatedUserId = null;

/**
 * @param {import('react').PropsWithChildren} props
 */
const AuthenticationProvider = (props) => {
  const { children } = props;

  const [authenticatedUserId, setAuthenticatedUserId] = useState(
    defaultAuthenticatedUserId
  );

  useEffect(() => {
    FirebaseAuth.subscribeToAuthStateChange(
      (user) => setAuthenticatedUserId(user.uid),
      () => setAuthenticatedUserId(null)
    );
  }, []);

  /**
   * @param {string} email
   * @param {string} password
   */
  const loginWithEmailAndPassword = async (email, password) => {
    const user = await FirebaseAuth.loginWithEmailAndPassword(email, password);

    setAuthenticatedUserId(user.uid);
  };

  return (
    <AuthenticationContext.Provider
      value={{
        authenticated: !!authenticatedUserId,
        authenticatedUserId,
        loginWithEmailAndPassword,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

AuthenticationProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthenticationProvider;
