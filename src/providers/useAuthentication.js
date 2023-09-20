import { useContext } from 'react';
import { AuthenticationContext } from './AuthenticationProvider';

const useAuthentication = () => {
  const state = useContext(AuthenticationContext);

  return {
    ...state,
    authenticatedUserId: /** @type {string} */ (state.authenticatedUserId),
  };
};

export default useAuthentication;
