import { signInWithPopup } from 'firebase/auth';
import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../firebase';
import * as FirebaseAuth from '../firebase/auth';

/** @typedef {object} AuthenticationState
 * @property {boolean} authenticated
 * @property {string | null} authenticatedUserId
 * @property {(email: string, passowrd: string) => Promise<void>} loginWithEmailAndPassword
 * @property {() => Promise<void>} authenticateWithGoogle
 */

/** @type {AuthenticationState} */
const defaultAuthenticationState = {
  authenticated: false,
  loginWithEmailAndPassword: async () => {},
  authenticatedUserId: null,
  authenticateWithGoogle: async () => {},
};

export const AuthenticationContext = createContext(defaultAuthenticationState);

/**
 * @param {import('react').PropsWithChildren} props
 */
const AuthenticationProvider = (props) => {
  const { children } = props;

  const [authenticatedUserId, setAuthenticatedUserId] = useState(
    /** @type {string | null} */ (null)
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

    onUserLogged(user);
  };

  const authenticateWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    onUserLogged(user);
  };

  /**
   * @param {import('firebase/auth').User} user
   */
  const onUserLogged = (user) => {
    setAuthenticatedUserId(user.uid);
  };

  return (
    <AuthenticationContext.Provider
      value={{
        authenticated: !!authenticatedUserId,
        authenticatedUserId,
        loginWithEmailAndPassword,
        authenticateWithGoogle,
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
