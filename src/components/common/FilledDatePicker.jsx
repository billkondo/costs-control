import { DatePicker } from '@mui/x-date-pickers';
import PropTypes from 'prop-types';

/**
 * @param {{
 *  fullWidth?: boolean,
 *  datePickerProps: import('@mui/x-date-pickers').DatePickerProps
 * }} props
 */
const FilledDatePicker = (props) => {
  const { fullWidth = true, datePickerProps } = props;

  return (
    <DatePicker
      slotProps={{
        textField: {
          variant: 'filled',
          fullWidth,
          InputLabelProps: { shrink: true },
        },
      }}
      {...datePickerProps}
    />
  );
};

FilledDatePicker.propTypes = {
  fullWidth: PropTypes.bool,
  datePickerProps: PropTypes.object,
};

export default FilledDatePicker;
