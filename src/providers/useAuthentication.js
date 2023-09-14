import { useContext } from 'react';
import { AuthenticationContext } from './AuthenticationProvider';

const useAuthentication = () => {
  return useContext(AuthenticationContext);
};

export default useAuthentication;
