import {
  FormControl,
  InputLabel,
  FilledInput as MUIFilledInput,
} from '@mui/material';
import PropTypes from 'prop-types';

/**
 * @typedef {object} FilledInputProps
 * @property {string} id
 * @property {string} label
 * @property {unknown} [value]
 * @property {boolean} [fullWidth]
 * @property {React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>} [onChange]
 * @property {boolean} [readOnly]
 * @property {React.ReactNode} [startAdornment]
 * @property {boolean} [password]
 * @property {boolean} [email]
 */

/**
 * @param {FilledInputProps} props
 */
const FilledInput = (props) => {
  const {
    id,
    label,
    value,
    fullWidth = true,
    onChange,
    readOnly = false,
    startAdornment,
    password = false,
    email = false,
  } = props;

  /**
   * @returns {import('react').HTMLInputTypeAttribute}
   */
  const getType = () => {
    if (password) {
      return 'password';
    }

    if (email) {
      return 'email';
    }

    return 'text';
  };

  return (
    <FormControl fullWidth={fullWidth} variant="filled">
      <InputLabel htmlFor={id} shrink>
        {label}
      </InputLabel>
      <MUIFilledInput
        id={id}
        value={value}
        startAdornment={startAdornment}
        onChange={onChange}
        readOnly={readOnly}
        type={getType()}
        sx={{ paddingTop: 1 }}
      />
    </FormControl>
  );
};

FilledInput.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  fullWidth: PropTypes.bool,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  startAdornment: PropTypes.node,
  password: PropTypes.bool,
  email: PropTypes.bool,
};

export default FilledInput;
