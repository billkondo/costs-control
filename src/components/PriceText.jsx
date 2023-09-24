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

  const renderPrice = () => {
    const priceText = <>{brlFormat(value)}</>;

    if (variant === 'body1' || variant === 'body2') {
      return <b>{priceText}</b>;
    }

    return priceText;
  };

  return <Typography variant={variant}>{renderPrice()}</Typography>;
};

PriceText.propTypes = {
  value: PropTypes.number,
  variant: PropTypes.string,
};

export default PriceText;
