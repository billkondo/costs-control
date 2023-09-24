import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import MonthlyExpenses from '../firebase/firestore/MonthlyExpenses';
import useAuthentication from '../providers/useAuthentication';
import MonthlyExpensesChart from './MonthlyExpensesChart';

const LatestMonthExpenses = () => {
  const { authenticatedUserId } = useAuthentication();
  const [monthlyExpenses, setMonthlyExpenses] = useState(
    /** @type {MonthlyExpense[]} */ ([])
  );

  useEffect(() => {
    const unsubscribe = MonthlyExpenses.latestMonths.listener(
      authenticatedUserId,
      (monthlyExpenses) => {
        setMonthlyExpenses(monthlyExpenses);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [authenticatedUserId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography variant="h6">Latest months expenses</Typography>
      <MonthlyExpensesChart monthlyExpenses={monthlyExpenses} />
    </div>
  );
};

export default LatestMonthExpenses;
