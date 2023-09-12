import {
  FormControl,
  FormControlLabel,
  Switch as MUISwitch,
} from '@mui/material';
import PropTypes from 'prop-types';

/**
 * @typedef {object} SwitchProps
 * @property {string} label
 * @property {boolean} value
 * @property {(value: boolean) => void} onChange
 */

/**
 * @param {SwitchProps} props
 */
const Switch = (props) => {
  const { label, value, onChange } = props;

  return (
    <FormControl>
      <FormControlLabel
        label={label}
        control={
          <MUISwitch
            value={value}
            onChange={(_, checked) => onChange(checked)}
          />
        }
      />
    </FormControl>
  );
};

Switch.propTypes = {
  label: PropTypes.string,
  value: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Switch;
