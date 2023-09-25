import { Grid, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import FirebaseFirestore from '../firebase/firestore';
import useAuthentication from '../providers/useAuthentication';
import useSubscriptions from '../providers/useSubscriptions';
import PriceText from './PriceText';

const CurrentMonthExpense = () => {
  const { authenticatedUserId } = useAuthentication();
  const [currentMonthExpense, setCurrentMonthExpense] = useState(
    /** @type {UserMonthlyExpense | null} */ (null)
  );
  const { getMonthSubscriptionCost } = useSubscriptions();

  const expense = useMemo(() => {
    let cost = 0;

    if (currentMonthExpense) {
      cost += currentMonthExpense.value;
      cost += getMonthSubscriptionCost(currentMonthExpense);
    }

    return cost;
  }, [currentMonthExpense, getMonthSubscriptionCost]);

  useEffect(() => {
    const unsubscribe = FirebaseFirestore.MonthlyExpenses.currentMonth.listener(
      authenticatedUserId,
      (currentMonthExpense) => {
        setCurrentMonthExpense(currentMonthExpense);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [authenticatedUserId]);

  return (
    <Grid container direction="column">
      <Grid container item justifyContent="center">
        <Typography variant="h5">{`This month's total expense`}</Typography>
      </Grid>
      <Grid container item justifyContent="center">
        <PriceText value={expense} variant="h6" />
      </Grid>
    </Grid>
  );
};

export default CurrentMonthExpense;
