import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import validateStore from '../../common/validateStore';
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

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(/** @type {StoreError | null} */ (null));

  const onSubmit = async () => {
    try {
      setLoading(true);

      /** @type {Store} */
      const store = {
        name,
      };

      const errors = validateStore(store);

      if (errors) {
        return setErrors(errors);
      }

      await addStore(store);

      if (onSubmitted) {
        onSubmitted();
      }
    } finally {
      setLoading(false);
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
        errorText={errors?.name}
      />
      <LoadingButton
        onClick={onSubmit}
        variant="contained"
        loading={loading}
        sx={{ textTransform: 'none', marginTop: 3 }}
      >
        Save store
      </LoadingButton>
    </Box>
  );
};

StoresForm.propTypes = {
  onSubmitted: PropTypes.func,
};

export default StoresForm;
