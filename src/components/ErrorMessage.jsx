import { FormHelperText, colors } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * @typedef {object} ErrorMessageProps
 * @property {string} error
 */

/**
 * @param {import('react').PropsWithChildren} props
 */
const ErrorMessage = (props) => {
  const { children } = props;

  if (!children) {
    return null;
  }

  return (
    <FormHelperText
      sx={{
        margin: 0,
        marginTop: 1,
        textAlign: 'end',
        color: colors.red[800],
        fontSize: '14px',
      }}
    >
      <i>{children}</i>
    </FormHelperText>
  );
};

ErrorMessage.propTypes = {
  children: PropTypes.node,
};

export default ErrorMessage;
