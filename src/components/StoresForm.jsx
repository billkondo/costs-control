import { Box, Button } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import useStores from '../providers/useStores';
import FilledInput from './common/FilledInput';

/**
 * @typedef {object} StoresFormProps
 * @property {() => void} [onSubmitted]
 */

/**
 * @param {StoresFormProps} props
 */
const StoresForm = (props) => {
  const { onSubmitted } = props;
  const { addStore } = useStores();
  const [name, setName] = useState('');

  const onSubmit = async () => {
    /** @type {Store} */
    const store = {
      name,
    };

    await addStore(store);

    if (onSubmitted) {
      onSubmitted();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <FilledInput
        id="store-name"
        label="Name"
        onChange={(event) => {
          const newName = event.target.value;

          setName(newName);
        }}
      />
      <Button
        onClick={onSubmit}
        variant="contained"
        sx={{ textTransform: 'none', marginTop: 3 }}
      >
        Save store
      </Button>
    </Box>
  );
};

StoresForm.propTypes = {
  onSubmitted: PropTypes.func,
};

export default StoresForm;
