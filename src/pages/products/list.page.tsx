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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useDeleteProduct, useGetProducts } from '../../api/hooks/product/product.api';
import { ProductForm } from './components/ProductForm';
import { ProductFormValues, isUpdateProduct } from '../../api/hooks/product/product.schema';

export const ProductList = () => {
  const { data: products, isLoading, isError } = useGetProducts();
  const { mutate: deleteProduct } = useDeleteProduct();
  const [selectedProduct, setSelectedProduct] = useState<ProductFormValues | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const handleDelete = (id: number | null) => {
    if(!id) return;
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleEdit = (product: ProductFormValues) => {
    // Ensure we're passing a proper update object
    const editValues: ProductFormValues = {
      ...product,
      id: product.id // This is now properly typed
    };
    setSelectedProduct(editValues);
    setOpenForm(true);
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography color="error">Error loading products</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Products</Typography>
        <Button
          variant="contained"
          onClick={() => {
            setSelectedProduct({
              name: '',
              description: '',
              price: 0,
              stock: 0,
              images: [],
              category_id: 1 // Default category
            });
            setOpenForm(true);
          }}
        >
          Add Product
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Images</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products?.data?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.category?.name}</TableCell>
                <TableCell>
                  {product.images?.length > 0 && (
                    <Chip label={`${product.images.length} images`} size="small" />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(product)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product.id || null)}>
                    <Delete color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedProduct && isUpdateProduct(selectedProduct) 
            ? 'Edit Product' 
            : 'Create Product'}
        </DialogTitle>
        <DialogContent>
          <ProductForm
            initialData={selectedProduct || undefined}
            onSuccess={() => {
              setOpenForm(false);
              setSelectedProduct(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};