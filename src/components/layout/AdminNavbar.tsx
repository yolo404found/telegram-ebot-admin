import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export const AdminNavbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Admin Dashboard
        </Typography>
        <Button color="inherit" component={RouterLink} to="/admin">
          Admins
        </Button>
        <Button color="inherit" component={RouterLink} to="/admin/create">
          Create Admin
        </Button>
      </Toolbar>
    </AppBar>
  );
};