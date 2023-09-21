import PropTypes from 'prop-types';
import { createContext, useCallback, useEffect, useState } from 'react';
import FirebaseFirestore from '../firebase/firestore';
import FirebaseFunctions from '../firebase/functions';
import useAuthentication from './useAuthentication';

/**
 * @typedef {object} SubscriptionsState
 * @property {number} currentMonthSubscriptionsCount
 * @property {(subscription: Subscription) => Promise<void>} addSubscription
 */

/** @type {SubscriptionsState} */
const defaultSubscriptionsState = {
  currentMonthSubscriptionsCount: 0,
  addSubscription: async () => {},
};

export const SubscriptionsContext = createContext(defaultSubscriptionsState);

/**
 * @param {import('react').PropsWithChildren} props
 */
const SubscriptionsProvider = (props) => {
  const { children } = props;
  const { authenticatedUserId } = useAuthentication();
  const [currentMonthSubscriptionsCount, setCurrentMonthSubscriptionsCount] =
    useState(0);

  const loadCurrentMonthSubscriptionsLength = useCallback(async () => {
    const count = await FirebaseFirestore.Subscriptions.currentMonth.count(
      authenticatedUserId
    );

    setCurrentMonthSubscriptionsCount(count);
  }, [authenticatedUserId]);

  useEffect(() => {
    loadCurrentMonthSubscriptionsLength();
  }, [loadCurrentMonthSubscriptionsLength]);

  /**
   * @param {Subscription} subscription
   */
  const addSubscription = async (subscription) => {
    await FirebaseFunctions.subscriptions.add(subscription);
    await loadCurrentMonthSubscriptionsLength();
  };

  return (
    <SubscriptionsContext.Provider
      value={{ currentMonthSubscriptionsCount, addSubscription }}
    >
      {children}
    </SubscriptionsContext.Provider>
  );
};

SubscriptionsProvider.propTypes = {
  children: PropTypes.node,
};

export default SubscriptionsProvider;
