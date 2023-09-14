import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * @template T
 * @typedef {object} Item
 * @property {string} label
 * @property {T} value
 */

/**
 * @template T
 * @typedef {object} FilledSelectorProps<T>
 * @property {string} id
 * @property {Item<T>[]} items
 * @property {string} label
 * @property {(value: T) => void} [onChange]
 * @property {T} [value]
 */

/**
 * @template T
 * @param {FilledSelectorProps<T>} props
 */
const FilledSelector = (props) => {
  const { id, items, label, onChange, value } = props;

  return (
    <FormControl fullWidth variant="filled">
      <InputLabel htmlFor={id} shrink>
        {label}
      </InputLabel>
      <Select
        id={id}
        value={value}
        onChange={(event) => {
          const newValue = event.target.value;

          // @ts-ignore
          onChange(newValue);
        }}
        sx={{ paddingTop: 1 }}
      >
        {items.map((item) => {
          const { label, value } = item;

          return (
            // @ts-ignore
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

FilledSelector.propTypes = {
  id: PropTypes.string,
  items: PropTypes.array,
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.any,
};

export default FilledSelector;
