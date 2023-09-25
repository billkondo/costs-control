import { Add } from '@mui/icons-material';
import CardsForm from './CardsForm';
import DialogButton from './common/DialogButton';

const AddCardButton = () => {
  return (
    <DialogButton
      dialogTitle="New card"
      icon={<Add />}
      hintText="Add Card"
      renderDialogBody={(closeDialog) => (
        <CardsForm onSubmitted={closeDialog} />
      )}
    />
  );
};

export default AddCardButton;
