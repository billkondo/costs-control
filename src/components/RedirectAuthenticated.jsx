import PropTypes from 'prop-types';
import { Redirect, useLocation } from 'wouter';
import useAuthentication from '../providers/useAuthentication';

/**
 * @param {import("react").PropsWithChildren} props
 */
const RedirectAuthenticated = (props) => {
  const { children } = props;
  const { authenticated } = useAuthentication();
  const [location] = useLocation();
  const inLoginPage = location === '/login';

  if (inLoginPage && authenticated) {
    return <Redirect to="/" />;
  }

  if (authenticated) {
    return null;
  }

  return children;
};

RedirectAuthenticated.propTypes = {
  children: PropTypes.node,
};

export default RedirectAuthenticated;
