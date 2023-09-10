import { ChevronRight } from '@mui/icons-material';
import { Button, Card, Grid, List, ListItem, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { currentMonthSubscriptionsListener } from '../firebase/firestore';
import { AuthenticationContext } from '../providers/AuthenticationProvider';
import padStart from '../utils/padStart';

const CurrentMonthSubscriptionsList = () => {
  const { authenticatedUserId } = useContext(AuthenticationContext);

  const [currentMonthSubscriptions, setCurrentMonthSubscriptions] = useState(
    /** @type {UserSubscription[]} */ ([])
  );

  const hasAnySubscription = currentMonthSubscriptions.length > 0;
  const hasManySubscriptions = currentMonthSubscriptions.length > 5;

  useEffect(() => {
    const unsubscribe = currentMonthSubscriptionsListener(
      authenticatedUserId,
      (subscriptions) => {
        setCurrentMonthSubscriptions(subscriptions);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [authenticatedUserId]);

  /**
   * @param {UserSubscription} subscription
   */
  const formatDate = (subscription) => {
    const { day } = subscription;
    const now = new Date();
    const currentMonth = now.getMonth();

    return `${padStart(day)} / ${padStart(currentMonth)}`;
  };

  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="h5">{`This month's subscriptions`}</Typography>
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
            {currentMonthSubscriptions.map((userSubscription) => {
              const { id, value } = userSubscription;

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
                      sx={{
                        flexGrow: 1,
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Typography variant="body2">
                        {formatDate(userSubscription)}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              );
            })}
            {!hasAnySubscription ? (
              <Grid
                container
                direction="column"
                sx={{ p: 3 }}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item>
                  <Typography variant="body1">
                    <i>There are no subscriptions</i>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                    <i>this month</i>
                  </Typography>
                </Grid>
              </Grid>
            ) : null}
            {hasManySubscriptions ? (
              <ListItem>
                <Grid container justifyContent="flex-end">
                  <Button
                    sx={{ textTransform: 'none' }}
                    endIcon={<ChevronRight />}
                  >
                    View All
                  </Button>
                </Grid>
              </ListItem>
            ) : null}
          </Card>
        </List>
      </Grid>
    </Grid>
  );
};

export default CurrentMonthSubscriptionsList;
