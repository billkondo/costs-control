import { useCallback, useEffect, useMemo } from 'react';
import usePagination from '../utils/pagination/usePagination';
import FirebaseFirestore from '../firebase/firestore';
import useAuthentication from '../providers/useAuthentication';
import useIncompleteExpenses from './useIncompleteExpenses';

const useOngoingExpensesPagination = () => {
  const { authenticatedUserId } = useAuthentication();

  const getItems = useMemo(() => {
    return FirebaseFirestore.expenses.ongoing.pager(authenticatedUserId);
  }, [authenticatedUserId]);

  const getTotal = useCallback(async () => {
    return FirebaseFirestore.expenses.ongoing.count(authenticatedUserId);
  }, [authenticatedUserId]);

  const { items, ...rest } = usePagination({
    getItems,
    getTotal,
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

export default useOngoingExpensesPagination;
