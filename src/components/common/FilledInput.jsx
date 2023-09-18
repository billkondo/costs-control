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
  } = props;

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
};

export default FilledInput;
