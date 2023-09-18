import { Close } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { Fragment, useState } from 'react';

/**
 * @param {{
 *  buttonProps?: import('@mui/material').ButtonProps,
 *  buttonText?: string,
 *  renderDialogBody: (closeDialog: () => void) => JSX.Element,
 *  dialogTitle?: string,
 *  fullScreen?: boolean,
 *  hintText?: string,
 *  icon?: React.ReactNode,
 * }} props
 */
const DialogButton = (props) => {
  const {
    buttonProps = {},
    buttonText,
    renderDialogBody,
    dialogTitle,
    fullScreen = false,
    hintText,
    icon,
  } = props;
  const [open, setOpen] = useState(false);

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  const isIconButton = !!icon;

  const iconButton = (
    <Tooltip title={hintText}>
      <IconButton onClick={openDialog} {...buttonProps}>
        {icon}
      </IconButton>
    </Tooltip>
  );

  const button = (
    <Button
      sx={{ textTransform: 'none' }}
      onClick={openDialog}
      {...buttonProps}
    >
      {buttonText}
    </Button>
  );

  const titleLess = !dialogTitle;

  return (
    <Fragment>
      {isIconButton ? iconButton : button}
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
            <Grid item sx={{ paddingTop: titleLess ? 2 : 0 }}>
              {renderDialogBody(closeDialog)}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

DialogButton.propTypes = {
  buttonProps: PropTypes.object,
  buttonText: PropTypes.string,
  renderDialogBody: PropTypes.func,
  dialogTitle: PropTypes.string,
  fullScreen: PropTypes.bool,
  hintText: PropTypes.string,
  icon: PropTypes.node,
};

export default DialogButton;
