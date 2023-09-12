import { Close } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { Fragment, useState } from 'react';

/**
 * @param {{
 *  buttonProps?: import('@mui/material').ButtonProps,
 *  buttonText: string,
 *  dialogTitle: string,
 *  dialogBody: JSX.Element
 *  fullScreen?: boolean
 * }} props
 */
const DialogButton = (props) => {
  const {
    buttonProps = {},
    buttonText,
    dialogTitle,
    dialogBody,
    fullScreen = false,
  } = props;
  const [open, setOpen] = useState(false);

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  return (
    <Fragment>
      <Button
        sx={{ textTransform: 'none' }}
        onClick={openDialog}
        {...buttonProps}
      >
        {buttonText}
      </Button>
      <Dialog open={open} fullWidth fullScreen={fullScreen}>
        <DialogContent>
          <Grid container direction="column">
            <Grid item sx={{ position: 'relative', marginBottom: 3 }}>
              <Typography variant="h6">{dialogTitle}</Typography>
              <IconButton
                size="small"
                onClick={closeDialog}
                sx={{ position: 'absolute', right: -16, top: -8 }}
              >
                <Close />
              </IconButton>
            </Grid>
            <Grid item>{dialogBody}</Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

DialogButton.propTypes = {
  buttonProps: PropTypes.object,
  buttonText: PropTypes.string,
  dialogTitle: PropTypes.string,
  dialogBody: PropTypes.node,
  fullScreen: PropTypes.bool,
};

export default DialogButton;
