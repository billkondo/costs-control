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
import ExpenseForm from './ExpenseForm';

const AddExpenseButton = () => {
  const [open, setOpen] = useState(false);

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return (
    <Fragment>
      <Button variant="contained" size="small" onClick={openDialog}>
        Add Expense
      </Button>
      <Dialog open={open} fullWidth>
        <DialogContent>
          <Grid container direction="column">
            <Grid item sx={{ position: 'relative', marginBottom: 3 }}>
              <Typography variant="h6">New expense</Typography>
              <IconButton
                size="small"
                onClick={closeDialog}
                sx={{ position: 'absolute', right: -16, top: -8 }}
              >
                <Close />
              </IconButton>
            </Grid>
            <Grid item>
              <ExpenseForm onExpenseSaved={closeDialog} />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default AddExpenseButton;
