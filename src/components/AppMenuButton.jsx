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
import { Link } from 'wouter';

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
              <Link href="/cards">
                <ListItemButton>
                  <ListItemIcon>
                    <CreditCard />
                  </ListItemIcon>
                  <ListItemText primary="Cards" />
                </ListItemButton>
              </Link>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Fragment>
  );
};

export default AppMenuButton;
