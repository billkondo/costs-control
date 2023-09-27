import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Link } from 'wouter';
import AppMenuButton from './AppMenuButton';

/**
 * @param {import("react").PropsWithChildren} props
 */
const HeaderPage = (props) => {
  const { children } = props;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        height: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem',
        }}
      >
        <AppMenuButton />
        <Link href="/">
          <Typography variant="h6" sx={{ cursor: 'pointer' }}>
            Costs Control
          </Typography>
        </Link>
      </div>
      <div
        style={{
          paddingLeft: '1rem',
          paddingRight: '1rem',
          flexGrow: 1,
          width: '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
};

HeaderPage.propTypes = {
  children: PropTypes.node,
};

export default HeaderPage;
