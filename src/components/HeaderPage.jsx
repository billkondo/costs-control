import { Grid, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import AppMenuButton from './AppMenuButton';

/**
 * @param {import("react").PropsWithChildren} props
 */
const HeaderPage = (props) => {
  const { children } = props;

  return (
    <Grid
      container
      direction="column"
      style={{ minHeight: '100vh', height: '100%' }}
    >
      <Grid
        container
        item
        style={{ padding: '1rem' }}
        alignItems="center"
        spacing={1}
      >
        <Grid item>
          <AppMenuButton />
        </Grid>
        <Grid item>
          <Typography variant="h6">Expenses Manager</Typography>
        </Grid>
      </Grid>

      <Grid
        item
        style={{ paddingLeft: '1rem', paddingRight: '1rem', flexGrow: 1 }}
        xs={12}
      >
        {children}
      </Grid>
    </Grid>
  );
};

HeaderPage.propTypes = {
  children: PropTypes.node,
};

export default HeaderPage;
