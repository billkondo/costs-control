import { Grid, Tooltip, Typography } from '@mui/material';
import useCards from '../providers/useCards';
import AddCardButton from './AddCardButton';
import ListWithControls from './common/List/ListWithControls';

/**
 * @param {ListWithControlsSelectProps<UserCard>} props
 */
const CardsList = (props) => {
  const { cards } = useCards();

  return (
    <ListWithControls
      {...props}
      title="You cards"
      controls={<AddCardButton />}
      items={cards}
      bodyHeader={
        <Grid container spacing={4} sx={{ marginBottom: 1 }}>
          <Grid item sx={{ flexGrow: 1 }}>
            <Typography variant="body1">
              <b>Card name</b>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              <b>Last four digits</b>
            </Typography>
          </Grid>
          <Grid item>
            <Tooltip title="Buys after this date will be charged on the following month">
              <Typography variant="body1">
                <b>Last buy day</b>
              </Typography>
            </Tooltip>
          </Grid>
        </Grid>
      }
      renderItem={(card) => {
        const { name, lastFourDigits, lastBuyDay } = card;

        return (
          <Grid container spacing={4}>
            <Grid item sx={{ flexGrow: 1 }}>
              <Typography variant="body1">{name}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">{lastFourDigits}</Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="body1"
                style={{ visibility: 'hidden', height: 0 }}
              >
                <b>Last buy day</b>
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'end' }}>
                {lastBuyDay}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
};

export default CardsList;
