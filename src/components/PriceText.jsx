import { Typography } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * @param {{
 *  value: number
 * }} props
 */
const PriceText = (props) => {
  const { value } = props;

  return (
    <Typography variant="body1">
      <b>{`R$ ${value.toFixed(2)}`}</b>
    </Typography>
  );
};

PriceText.propTypes = {
  value: PropTypes.number,
};

export default PriceText;
