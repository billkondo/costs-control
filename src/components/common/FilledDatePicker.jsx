import { DatePicker } from '@mui/x-date-pickers';
import PropTypes from 'prop-types';
import ErrorMessage from '../ErrorMessage';

/**
 * @typedef {object} FilledDatePickerProps
 * @property {boolean} [fullWidth]
 * @property {(date: Date | null) => void} [onChange]
 * @property {string} label
 * @property {import('@mui/x-date-pickers').DatePickerProps<import('dayjs').Dayjs>} [datePickerProps]
 * @property {boolean} [disableOpenPicker]
 * @property {import('@mui/x-date-pickers').DateView[]} [views]
 * @property {string} [errorText]
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
    errorText = '',
  } = props;
  const error = !!errorText;

  return (
    <>
      <DatePicker
        slotProps={{
          textField: {
            variant: 'filled',
            fullWidth,
            InputLabelProps: { error, shrink: true },
            InputProps: {
              error,
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
      <ErrorMessage>{errorText}</ErrorMessage>
    </>
  );
};

FilledDatePicker.propTypes = {
  fullWidth: PropTypes.bool,
  onChange: PropTypes.func,
  datePickerProps: PropTypes.object,
  label: PropTypes.string,
  disableOpenPicker: PropTypes.bool,
  views: PropTypes.array,
  errorText: PropTypes.string,
};

export default FilledDatePicker;
