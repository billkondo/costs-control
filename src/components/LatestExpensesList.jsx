import { Card, Grid, List, ListItem, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { latestExpensesListener } from '../firebase/firestore';
import { AuthenticationContext } from '../providers/AuthenticationProvider';
import padStart from '../utils/padStart';

/** @type {UserExpense[]} */
const defaultLatestExpenses = [];

const LatestExpensesList = () => {
  const { authenticatedUserId } = useContext(AuthenticationContext);

  const [latestExpenses, setLatestExpenses] = useState(defaultLatestExpenses);

  const hasAnyExpense = latestExpenses.length > 0;

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
    const month = date.getMonth();
    const day = date.getDate();

    return `${padStart(day)} / ${padStart(month)}`;
  };

  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="h6">Lastest expenses</Typography>
      </Grid>

      <Grid item>
        <List
          sx={{
            width: '100%',
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

            {!hasAnyExpense ? (
              <Grid
                container
                direction="column"
                sx={{ p: 3 }}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item>
                  <Typography variant="body1">
                    <i>There are no expenses</i>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                    <i>this month</i>
                  </Typography>
                </Grid>
              </Grid>
            ) : null}
          </Card>
        </List>
      </Grid>
    </Grid>
  );
};

export default LatestExpensesList;
