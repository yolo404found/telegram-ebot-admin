import { Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { AdminPanelSettingsOutlined, ListAltOutlined, TocOutlined } from '@mui/icons-material';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth - 40,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
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
});

const StyledDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
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
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));


interface AdminSidebarProps {
  open: boolean;
  handleDrawerClose: () => void;
}

export const AdminSidebar = ({ open, handleDrawerClose }: AdminSidebarProps) => {

    const navigate = useNavigate();
    const handleOnNavigate = (route:string) => {
        if(!route) return;
        navigate(route);
    };

  return (
    <StyledDrawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon sx={{width:20,height:20}} />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {[
          { text: 'Admins', icon: <AdminPanelSettingsOutlined />, path: '/admins' },
          { text: 'Products', icon: <ListAltOutlined />, path: '/products' },
          { text: 'Categories', icon: <TocOutlined />, path: '/categories' },
          { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
          { text: 'Orders', icon: <ShoppingCartIcon />, path: '/orders' },
        ].map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
                onClick={()=>{handleOnNavigate(item.path)}}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </StyledDrawer>
  );
};