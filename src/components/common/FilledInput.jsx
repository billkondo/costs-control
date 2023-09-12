import {
  FormControl,
  InputLabel,
  FilledInput as MUIFilledInput,
} from '@mui/material';
import PropTypes from 'prop-types';

/**
 * @param {{
 *  id: string,
 *  label: string,
 *  value?: unknown,
 *  fullWidth?: boolean,
 *  onChange?: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>,
 *  startAdornment?: React.ReactNode
 * }} props
 */
const FilledInput = (props) => {
  const {
    id,
    label,
    value,
    fullWidth = true,
    onChange,
    startAdornment,
  } = props;

  return (
    <FormControl fullWidth={fullWidth} variant="filled">
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <MUIFilledInput
        id={id}
        value={value}
        startAdornment={startAdornment}
        onChange={onChange}
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
  startAdornment: PropTypes.node,
};

export default FilledInput;
