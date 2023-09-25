import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import {
  Grid,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { CurrentMonthSubscriptionsPager } from '../firebase/firestore/Subscriptions';
import useAuthentication from '../providers/useAuthentication';
import useSubscriptions from '../providers/useSubscriptions';
import formatSubscriptionDate from '../usecases/formatSubscriptionDate';
import useIncompleteSubscriptions from '../usecases/useIncompleteSubscriptions';
import PriceText from './PriceText';

const CurrentMonthSubscriptionsTable = () => {
  const { currentMonthSubscriptionsCount: total } = useSubscriptions();
  const { authenticatedUserId } = useAuthentication();
  const { subscriptions: items, setIncompleteSubscriptions: setItems } =
    useIncompleteSubscriptions();

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const PAGE_SIZE = 5;

  const maxPages = Math.ceil(total / PAGE_SIZE);
  const inLastPage = page + 1 === maxPages;
  const startItem = page * PAGE_SIZE;
  const endItem = inLastPage ? total : (page + 1) * PAGE_SIZE;

  const query = useMemo(() => {
    return CurrentMonthSubscriptionsPager(authenticatedUserId);
  }, [authenticatedUserId]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setItems([]);

        const subscriptions = await query(startItem);

        setItems(subscriptions);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [startItem, query, setItems]);

  const onNext = () => setPage(page + 1);
  const onBack = () => setPage(page - 1);

  return (
    <TableContainer
      sx={{
        minHeight: '400px',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        borderRadius: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Value</TableCell>
            <TableCell align="right">Charge date</TableCell>
          </TableRow>
        </TableHead>

        {loading ? (
          <TableBody sx={{ width: '100%' }}>
            <TableRow sx={{ minWidth: '100%' }}>
              <TableCell
                colSpan={2}
                sx={{
                  border: 'none',
                  p: 0,
                }}
              >
                <LinearProgress />
              </TableCell>
            </TableRow>
          </TableBody>
        ) : null}

        {!loading ? (
          <TableBody>
            {items.map((subscription) => {
              const { id, value } = subscription;

              return (
                <TableRow key={id}>
                  <TableCell component="th" scope="row">
                    <PriceText value={value} />
                  </TableCell>
                  <TableCell align="right">
                    {formatSubscriptionDate(subscription)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        ) : null}
      </Table>
      <Grid
        container
        alignItems="flex-end"
        justifyContent="flex-end"
        sx={{ p: 1, flexGrow: 1 }}
      >
        <Grid container justifyContent="flex-end" alignItems="center">
          <Grid item sx={{ marginRight: 3 }}>
            <Typography>{`${startItem + 1}-${endItem} of ${total}`}</Typography>
          </Grid>
          <Grid item>
            <IconButton disabled={page === 0} onClick={onBack}>
              <ChevronLeft />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton disabled={inLastPage} onClick={onNext}>
              <ChevronRight />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </TableContainer>
  );
};

export default CurrentMonthSubscriptionsTable;
