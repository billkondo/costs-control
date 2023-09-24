import PropTypes from 'prop-types';
import FilledDatePicker from './FilledDatePicker';

/**
 * @typedef {object} FilledMonthPickerOnlyProps
 * @property {(month: number | null) => void} onMonthChange
 * @typedef {import('./FilledDatePicker').FilledDatePickerProps & FilledMonthPickerOnlyProps} FilledMonthPickerProps
 */

/**
 * @param {FilledMonthPickerProps} props
 */
const FilledMonthPicker = (props) => {
  const { onMonthChange } = props;

  return (
    <FilledDatePicker
      {...props}
      views={['month']}
      onChange={(date) => {
        if (date) {
          onMonthChange(date.getMonth());
        } else {
          onMonthChange(null);
        }
      }}
    />
  );
};

FilledMonthPicker.propTypes = {
  onMonthChange: PropTypes.func,
};

export default FilledMonthPicker;
