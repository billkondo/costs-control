import PropTypes from 'prop-types';
import { Redirect } from 'wouter';
import useAuthentication from '../providers/useAuthentication';

/**
 * @param {import("react").PropsWithChildren} props
 */
const RedirectAuthenticated = (props) => {
  const { children } = props;
  const { authenticated } = useAuthentication();

  if (authenticated) {
    return <Redirect to="/" />;
  }

  return children;
};

RedirectAuthenticated.propTypes = {
  children: PropTypes.node,
};

export default RedirectAuthenticated;
