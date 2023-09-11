import { useContext } from 'react';
import { SubscriptionsContext } from './SubscriptionsProvider';

const useSubscriptions = () => {
  return useContext(SubscriptionsContext);
};

export default useSubscriptions;
