import { Grid, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import FirebaseFirestore from '../firebase/firestore';
import useAuthentication from '../providers/useAuthentication';

const CurrentMonthExpense = () => {
  const { authenticatedUserId } = useAuthentication();
  const [currentMonthExpense, setCurrentMonthExpense] = useState(
    /** @type {UserMonthlyExpense | null} */ (null)
  );

  const expense = useMemo(() => {
    let cost = 0;

    if (currentMonthExpense) {
      cost += currentMonthExpense.value;
    }

    return cost;
  }, [currentMonthExpense]);

  useEffect(() => {
    const unsubscribeMonthExpenseListener =
      FirebaseFirestore.MonthlyExpenses.listener(
        authenticatedUserId,
        (currentMonthExpense) => {
          setCurrentMonthExpense(currentMonthExpense);
        }
      );

    return () => {
      unsubscribeMonthExpenseListener();
    };
  }, [authenticatedUserId]);

  return (
    <Grid container direction="column">
      <Grid container item justifyContent="center">
        <Typography variant="h5">{`This month's total expense`}</Typography>
      </Grid>
      <Grid container item justifyContent="center">
        <Typography variant="h6">{`R$ ${expense.toFixed(2)}`}</Typography>
      </Grid>
    </Grid>
  );
};

export default CurrentMonthExpense;
