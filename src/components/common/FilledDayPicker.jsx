import PropTypes from 'prop-types';
import FilledDatePicker from './FilledDatePicker';

/**
 * @typedef {object} FilledDayPickerOnlyProps
 * @property {(day: number | null) => void} onDayChange
 * @typedef {import('./FilledDatePicker').FilledDatePickerProps & FilledDayPickerOnlyProps} FilledDayPickerProps
 */

/**
 * @param {FilledDayPickerProps} props
 */
const FilledDayPicker = (props) => {
  const { onDayChange } = props;

  return (
    <FilledDatePicker
      {...props}
      disableOpenPicker
      views={['day']}
      onChange={(date) => {
        if (date) {
          onDayChange(date.getDate());
        } else {
          onDayChange(null);
        }
      }}
    />
  );
};

FilledDayPicker.propTypes = {
  onDayChange: PropTypes.func,
};

export default FilledDayPicker;
