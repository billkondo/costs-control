import { DatePicker } from '@mui/x-date-pickers';
import PropTypes from 'prop-types';

/**
 * @typedef {object} FilledDatePickerProps
 * @property {boolean} [fullWidth]
 * @property {(date: Date | null) => void} [onChange]
 * @property {string} label
 * @property {import('@mui/x-date-pickers').DatePickerProps<import('dayjs').Dayjs>} [datePickerProps]
 * @property {boolean} [disableOpenPicker]
 * @property {import('@mui/x-date-pickers').DateView[]} [views]
 */

/**
 * @param {FilledDatePickerProps} props
 */
const FilledDatePicker = (props) => {
  const {
    fullWidth = true,
    datePickerProps = {},
    label = '',
    onChange = () => {},
    disableOpenPicker = false,
    views,
  } = props;

  return (
    <DatePicker
      slotProps={{
        textField: {
          variant: 'filled',
          fullWidth,
          InputLabelProps: { shrink: true },
          InputProps: {
            sx: {
              paddingTop: 1,
            },
          },
        },
      }}
      {...datePickerProps}
      views={views}
      label={label}
      disableOpenPicker={disableOpenPicker}
      onChange={(date) => {
        if (date) {
          onChange(date.toDate());
        } else {
          onChange(null);
        }
      }}
    />
  );
};

FilledDatePicker.propTypes = {
  fullWidth: PropTypes.bool,
  onChange: PropTypes.func,
  datePickerProps: PropTypes.object,
  label: PropTypes.bool,
  disableOpenPicker: PropTypes.bool,
  views: PropTypes.array,
};

export default FilledDatePicker;
