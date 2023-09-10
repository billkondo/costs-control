import { Close } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { Fragment, useState } from 'react';
import SubscriptionForm from './SubscriptionForm';

const AddSubscriptionButton = () => {
  const [open, setOpen] = useState(false);

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return (
    <Fragment>
      <Button
        variant="contained"
        size="small"
        onClick={openDialog}
        color="secondary"
        sx={{ textTransform: 'none' }}
      >
        Add subscription
      </Button>
      <Dialog open={open} fullWidth>
        <DialogContent>
          <Grid container direction="column">
            <Grid item sx={{ position: 'relative', marginBottom: 3 }}>
              <Typography variant="h6">New subscription</Typography>
              <IconButton
                size="small"
                onClick={closeDialog}
                sx={{ position: 'absolute', right: -16, top: -8 }}
              >
                <Close />
              </IconButton>
            </Grid>
            <Grid item>
              <SubscriptionForm onSubscriptionSaved={closeDialog} />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default AddSubscriptionButton;
