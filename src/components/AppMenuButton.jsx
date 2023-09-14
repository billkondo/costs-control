import { CreditCard, Menu } from '@mui/icons-material';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Fragment, useState } from 'react';

const AppMenuButton = () => {
  const [open, setOpen] = useState(false);

  const openMenu = () => setOpen(true);
  const closeMenu = () => setOpen(false);

  return (
    <Fragment>
      <IconButton onClick={openMenu}>
        <Menu />
      </IconButton>
      <Drawer open={open} onClose={closeMenu}>
        <Box sx={{ width: 250 }}>
          <List>
            <ListItem>
              <ListItemButton>
                <ListItemIcon>
                  <CreditCard />
                </ListItemIcon>
                <ListItemText primary="Cards" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Fragment>
  );
};

export default AppMenuButton;
