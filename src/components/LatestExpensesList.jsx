import { Card, Grid, List, ListItem, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { latestExpensesListener } from '../firebase/firestore';
import { AuthenticationContext } from '../providers/AuthenticationProvider';

/** @type {UserExpense[]} */
const defaultLatestExpenses = [];

const LatestExpensesList = () => {
  const { authenticatedUserId } = useContext(AuthenticationContext);

  const [latestExpenses, setLatestExpenses] = useState(defaultLatestExpenses);

  useEffect(() => {
    const unsubscribe = latestExpensesListener(
      authenticatedUserId,
      (latestExpenses) => {
        setLatestExpenses(latestExpenses);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [authenticatedUserId]);

  /**
   * @param {Date} date
   * @returns {string}
   */
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    return `${padStart(day)} / ${padStart(month)} / ${year}`;
  };

  /**
   * @param {number} value
   * @returns {string}
   */
  const padStart = (value) => {
    if (value < 10) {
      return '0' + value;
    }

    return value.toString();
  };

  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="h5">Lastest expenses</Typography>
      </Grid>

      <Grid item>
        <List
          sx={{
            width: '100%',
            maxWidth: 360,
            bgcolor: 'background.paper',
          }}
        >
          <Card variant="outlined">
            {latestExpenses.map((userExpense) => {
              const { id, date, value } = userExpense;

              return (
                <ListItem key={id} divider>
                  <Grid container spacing={1}>
                    <Grid item>
                      <Typography variant="body1">
                        <b>{`R$ ${value.toFixed(2)}`}</b>
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      style={{
                        flexGrow: 1,
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Typography variant="body2">
                        {formatDate(date)}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              );
            })}
          </Card>
        </List>
      </Grid>
    </Grid>
  );
};

export default LatestExpensesList;
