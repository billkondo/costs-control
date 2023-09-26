import { Divider, Typography } from '@mui/material';

const OrDivider = () => {
  return (
    <div
      style={{ display: 'flex', width: '100%', alignItems: 'center', gap: 16 }}
    >
      <Divider sx={{ flexGrow: 1 }} />
      <Typography variant="body1">or</Typography>
      <Divider sx={{ flexGrow: 1 }} />
    </div>
  );
};

export default OrDivider;
