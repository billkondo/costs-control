import PropTypes from 'prop-types';
import { useContext } from 'react';
import { AuthenticationContext } from '../providers/AuthenticationProvider';

/**
 * @param {import("react").PropsWithChildren} props
 */
const OnlyAuthenticated = (props) => {
  const { children } = props;
  const { authenticated } = useContext(AuthenticationContext);

  if (!authenticated) {
    return null;
  }

  return children;
};

OnlyAuthenticated.propTypes = {
  children: PropTypes.node,
};

export default OnlyAuthenticated;
