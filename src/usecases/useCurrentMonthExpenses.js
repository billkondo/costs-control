import { useCallback, useMemo } from 'react';
import useAuthentication from '../providers/useAuthentication';
import useExpenses from '../providers/useExpenses';
import usePagination from '../utils/pagination/usePagination';
import useIncompleteExpenses from './useIncompleteExpenses';
import { useEffect } from 'react';
import FirebaseFirestore from '../firebase/firestore';

const useCurrentMonthExpenses = () => {
  const { authenticatedUserId } = useAuthentication();
  const { emmiter } = useExpenses();

  const getItems = useMemo(() => {
    return FirebaseFirestore.expenses.currentMonth.pager(authenticatedUserId);
  }, [authenticatedUserId]);

  const getTotal = useCallback(async () => {
    return FirebaseFirestore.expenses.currentMonth.count(authenticatedUserId);
  }, [authenticatedUserId]);

  const { items, ...rest } = usePagination({
    getItems,
    getTotal,
    emmiter,
    eventName: 'update',
  });

  const { expenses, setIncompleteExpenses } = useIncompleteExpenses();

  useEffect(() => {
    setIncompleteExpenses(items);
  }, [items, setIncompleteExpenses]);

  return {
    items: expenses,
    ...rest,
  };
};

export default useCurrentMonthExpenses;
