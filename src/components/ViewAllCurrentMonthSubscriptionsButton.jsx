import { ChevronRight, Close } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { Fragment, useState } from 'react';
import CurrentMonthSubscriptionsTable from './CurrentMonthSubscriptionsTable';

const ViewAllCurrentMonthSubscriptionsButton = () => {
  const [open, setOpen] = useState(false);

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return (
    <Fragment>
      <Button
        sx={{ textTransform: 'none' }}
        endIcon={<ChevronRight />}
        onClick={openDialog}
      >
        View All
      </Button>
      <Dialog open={open} fullWidth>
        <DialogContent>
          <Grid container direction="column">
            <Grid item sx={{ position: 'relative', marginBottom: 3 }}>
              <Typography variant="h6">{`This month's subscriptions`}</Typography>
              <IconButton
                size="small"
                onClick={closeDialog}
                sx={{ position: 'absolute', right: -16, top: -8 }}
              >
                <Close />
              </IconButton>
            </Grid>
            <Grid item>
              <CurrentMonthSubscriptionsTable />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default ViewAllCurrentMonthSubscriptionsButton;
