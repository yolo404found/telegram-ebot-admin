import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, CssBaseline, styled, useTheme } from '@mui/material';
import { AdminNavbar } from './AdminNavbar';
import { AdminSidebar } from './AdminSidebar';

const drawerWidth = 200;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export const MainLayout = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AdminNavbar open={open} handleDrawerOpen={handleDrawerOpen} />
      <AdminSidebar open={open} handleDrawerClose={handleDrawerClose} />
      <Main open={open}>
        <DrawerHeader />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Box sx={{ my: 4 }}>
            <Outlet />
          </Box>
        </Container>
      </Main>
    </Box>
  );
};