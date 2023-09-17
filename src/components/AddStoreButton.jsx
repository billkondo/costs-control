import { Add } from '@mui/icons-material';
import StoresForm from './StoresForm';
import DialogButton from './common/DialogButton';

const AddStoreButton = () => {
  return (
    <DialogButton
      dialogTitle="New store"
      hintText="Add store"
      icon={<Add />}
      renderDialogBody={(closeDialog) => (
        <StoresForm onSubmitted={closeDialog} />
      )}
    />
  );
};

export default AddStoreButton;
