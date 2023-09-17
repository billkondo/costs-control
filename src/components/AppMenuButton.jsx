import { CreditCard, Menu, Storefront } from '@mui/icons-material';
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

/**
 * @typedef {object} AppMenuItem
 * @property {React.ReactNode} icon
 * @property {string} label
 * @property {string} link
 */

/** @type {AppMenuItem[]} */
const items = [
  {
    icon: <CreditCard />,
    label: 'Cards',
    link: '/cards',
  },
  {
    icon: <Storefront />,
    label: 'Stores',
    link: '/stores',
  },
];

const AppMenuButton = () => {
  const [open, setOpen] = useState(false);

  const openMenu = () => setOpen(true);
  const closeMenu = () => setOpen(false);

  /**
   * @param {AppMenuItem} item
   */
  const renderItem = (item) => {
    const { icon, label, link } = item;

    return (
      <ListItem key={label} onClick={closeMenu}>
        <Link href={link}>
          <ListItemButton>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        </Link>
      </ListItem>
    );
  };

  return (
    <Fragment>
      <IconButton onClick={openMenu}>
        <Menu />
      </IconButton>
      <Drawer open={open} onClose={closeMenu}>
        <Box sx={{ width: 250 }}>
          <List>{items.map((item) => renderItem(item))}</List>
        </Box>
      </Drawer>
    </Fragment>
  );
};

export default AppMenuButton;
