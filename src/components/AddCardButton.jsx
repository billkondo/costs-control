import { Add } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import CardsForm from './CardsForm';
import DialogButton from './common/DialogButton';

const AddCardButton = () => {
  return (
    <Tooltip title="Add Card">
      <DialogButton
        dialogTitle="New card"
        icon={<Add />}
        hintText="Add Card"
        renderDialogBody={(closeDialog) => (
          <CardsForm onSubmitted={closeDialog} />
        )}
      />
    </Tooltip>
  );
};

export default AddCardButton;
