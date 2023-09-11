import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentMonthSubscriptionsLength } from '../firebase/firestore';
import { AuthenticationContext } from './AuthenticationProvider';

/**
 * @typedef {object} SubscriptionsState
 * @property {number} currentMonthSubscriptionsCount
 */

/** @type {import("react").Context<SubscriptionsState>} */
export const SubscriptionsContext = createContext({
  currentMonthSubscriptionsCount: 0,
});

/**
 * @param {import('react').PropsWithChildren} props
 */
const SubscriptionsProvider = (props) => {
  const { children } = props;
  const { authenticatedUserId } = useContext(AuthenticationContext);
  const [currentMonthSubscriptionsCount, setCurrentMonthSubscriptionsCount] =
    useState(0);

  useEffect(() => {
    const load = async () => {
      const count = await getCurrentMonthSubscriptionsLength(
        authenticatedUserId
      );

      setCurrentMonthSubscriptionsCount(count);
    };

    load();
  }, [authenticatedUserId]);

  return (
    <SubscriptionsContext.Provider value={{ currentMonthSubscriptionsCount }}>
      {children}
    </SubscriptionsContext.Provider>
  );
};

SubscriptionsProvider.propTypes = {
  children: PropTypes.node,
};

export default SubscriptionsProvider;
