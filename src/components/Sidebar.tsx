import * as React from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import RouterIcon from '@mui/icons-material/Router';
import SecurityIcon from '@mui/icons-material/Security';
import WifiIcon from '@mui/icons-material/Wifi';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: '#0A1929',
  color: '#ffffff',
  borderRight: '1px solid rgba(255, 255, 255, 0.12)',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  backgroundColor: '#0A1929',
  color: '#ffffff',
  borderRight: '1px solid rgba(255, 255, 255, 0.12)',
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', enabled: true },
  { text: 'Tenants', icon: <PeopleAltIcon />, path: '/tenants', enabled: false },
  { text: 'Fleets', icon: <DirectionsBoatIcon />, path: '/fleets', enabled: false },
  { text: 'Routers', icon: <RouterIcon />, path: '/routers', enabled: false },
  { text: 'Firewall Templates', icon: <SecurityIcon />, path: '/firewall-templates', enabled: false },
  { text: 'Hotspot Users', icon: <WifiIcon />, path: '/hotspot-users', enabled: false },
  { text: 'Audit Trail', icon: <AssessmentIcon />, path: '/audit-trail', enabled: true },
  { text: 'Billing', icon: <ReceiptIcon />, path: '/billing', enabled: false },
  { text: 'Admins', icon: <AdminPanelSettingsIcon />, path: '/admins', enabled: false },
];

const bottomMenuItems = [
  { text: 'Account', icon: <AccountCircleIcon />, path: '/account', enabled: false },
  { text: 'Log Out', icon: <LogoutIcon />, path: '/logout', enabled: false },
];

export default function Sidebar() {
  const [open, setOpen] = React.useState(true);
  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const renderMenuItem = (item: any) => {
    const isActive = pathname.includes(item.path);
    
    if (item.enabled) {
      return (
        <Link href={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              borderRadius: '4px',
              mx: 1,
              backgroundColor: isActive ? 'rgba(66, 133, 244, 0.15)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
                color: isActive ? '#4285F4' : '#ffffff',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{ 
                opacity: open ? 1 : 0,
                color: isActive ? '#4285F4' : 'inherit',
              }} 
            />
          </ListItemButton>
        </Link>
      );
    } else {
      return (
        <ListItemButton
          disabled
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
            borderRadius: '4px',
            mx: 1,
            opacity: 0.5,
            '&.Mui-disabled': {
              opacity: 0.5,
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
      );
    }
  };

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        {open ? (
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <span style={{ color: '#ffffff' }}>future</span>
            <span style={{ color: '#4285F4' }}>konnect</span>
          </Typography>
        ) : (
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              color: '#4285F4'
            }}
          >
            fk
          </Typography>
        )}
      </DrawerHeader>
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            {renderMenuItem(item)}
          </ListItem>
        ))}
      </List>
      
      <ListItem disablePadding sx={{ display: 'block', mt: 1 }}>
        <ListItemButton
          disabled
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
            borderRadius: '4px',
            mx: 1,
            mb: 2,
            border: '1px solid rgba(255, 255, 255, 0.23)',
            '&.Mui-disabled': {
              opacity: 0.7,
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <AddCircleOutlineIcon />
          </ListItemIcon>
          <ListItemText primary="Create" sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
      </ListItem>
      
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)', mx: 2 }} />
      
      <List>
        {bottomMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            {renderMenuItem(item)}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}