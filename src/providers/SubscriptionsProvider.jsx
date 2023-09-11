import PropTypes from 'prop-types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as FirebaseFirestore from '../firebase/firestore';
import { getCurrentMonthSubscriptionsLength } from '../firebase/firestore';
import { AuthenticationContext } from './AuthenticationProvider';

/**
 * @typedef {object} SubscriptionsState
 * @property {number} currentMonthSubscriptionsCount
 * @property {(subscription: Subscription) => Promise<void>} addSubscription
 */

/** @type {import("react").Context<SubscriptionsState>} */
export const SubscriptionsContext = createContext({
  currentMonthSubscriptionsCount: 0,
  addSubscription: async () => {},
});

/**
 * @param {import('react').PropsWithChildren} props
 */
const SubscriptionsProvider = (props) => {
  const { children } = props;
  const { authenticatedUserId } = useContext(AuthenticationContext);
  const [currentMonthSubscriptionsCount, setCurrentMonthSubscriptionsCount] =
    useState(0);

  const loadCurrentMonthSubscriptionsLength = useCallback(async () => {
    const count = await getCurrentMonthSubscriptionsLength(authenticatedUserId);

    setCurrentMonthSubscriptionsCount(count);
  }, [authenticatedUserId]);

  useEffect(() => {
    loadCurrentMonthSubscriptionsLength();
  }, [loadCurrentMonthSubscriptionsLength]);

  /**
   * @param {Subscription} subscription
   */
  const addSubscription = async (subscription) => {
    /** @type {UserSubscription} */
    const userSubscription = {
      ...subscription,
      userId: authenticatedUserId,
      id: null,
    };

    await FirebaseFirestore.addUserSubscription(userSubscription);
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
