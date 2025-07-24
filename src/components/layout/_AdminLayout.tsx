import { Outlet } from 'react-router-dom';
import { Box, Container, CssBaseline } from '@mui/material';

export const AdminLayout = () => {
  return (
    <>
      <CssBaseline />
      {/* <AdminNavbar /> */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ my: 4 }}>
          <Outlet />
        </Box>
      </Container>
    </>
  );
};