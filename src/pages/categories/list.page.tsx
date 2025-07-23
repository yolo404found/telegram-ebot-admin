import { useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useDeleteCategory, useGetCategories } from '../../api/hooks/category/category.api';
import { CategoryForm } from './components/CategoryForm';
import { FormDialog } from '../../components/form/FormDialog';

export const CategoryList = () => {
  const { data: categories, isLoading, isError } = useGetCategories();
  const { mutate: deleteCategory } = useDeleteCategory();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const handleDelete = (id: number | null) => {
    if(!id) return;
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
    }
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography color="error">Error loading categories</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Categories</Typography>
        <Button
          variant="contained"
          onClick={() => {
            setSelectedCategoryId(null);
            setOpenForm(true);
          }}
        >
          Add Category
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories?.data?.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  {category.description || '-'}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedCategoryId(category.id || null);
                      setOpenForm(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(category.id || null)}>
                    <Delete color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <FormDialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        title={selectedCategoryId ? 'Edit Category' : 'Create Category'}
      >
        <CategoryForm
          initialData={categories?.data?.find(c => c.id === selectedCategoryId)}
          onSuccess={() => {
            setOpenForm(false);
            setSelectedCategoryId(null);
          }}
        />
      </FormDialog>
    </Box>
  );
};