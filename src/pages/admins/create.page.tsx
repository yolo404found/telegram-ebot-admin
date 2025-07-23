import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { AdminForm } from './components';

export const CreateAdmin = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create New Admin
      </Typography>
      <AdminForm
        onSuccess={() => {
          navigate('/admin');
        }} 
      />
    </Box>
  );
};