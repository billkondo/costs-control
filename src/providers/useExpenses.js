import { useContext } from 'react';
import { ExpensesContext } from './ExpensesProvider';

const useExpenses = () => {
  return useContext(ExpensesContext);
};

export default useExpenses;
