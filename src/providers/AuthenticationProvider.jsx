import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from 'react';
import * as FirebaseAuth from '../firebase/auth';

/** @type {import('./types').AuthenticationState} */
const defaultAuthenticationState = {
  authenticated: false,
  loginWithEmailAndPassword: async () => {},
};

/** @type {import('react').Context<import('./types').AuthenticationState>} */
export const AuthenticationContext = createContext(defaultAuthenticationState);

/**
 *
 * @param {import('react').PropsWithChildren} props
 * @returns
 */
const AuthenticationProvider = (props) => {
  const { children } = props;
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    FirebaseAuth.subscribeToAuthStateChange(
      () => setAuthenticated(true),
      () => setAuthenticated(false)
    );
  }, []);

  /**
   * @param {string} email
   * @param {string} password
   */
  const loginWithEmailAndPassword = async (email, password) => {
    await FirebaseAuth.loginWithEmailAndPassword(email, password);
    setAuthenticated(true);
  };

  return (
    <AuthenticationContext.Provider
      value={{ authenticated, loginWithEmailAndPassword }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

AuthenticationProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthenticationProvider;
