import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import brlFormat from '../utils/currency/brlFormat';

/**
 * @param {{
 *  value: number,
 *  variant?: import('@mui/material/styles/createTypography').Variant
 * }} props
 */
const PriceText = (props) => {
  const { value, variant = 'body1' } = props;

  return <Typography variant={variant}>{brlFormat(value)}</Typography>;
};

PriceText.propTypes = {
  value: PropTypes.number,
  variant: PropTypes.string,
};

export default PriceText;
