import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productBaseSchema, updateProductSchema, ProductFormValues, isUpdateProduct, UpdateProductDto } from '../../../api/hooks/product/product.schema';
import { useCreateProduct, useUpdateProduct } from '../../../api/hooks/product/product.api';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import { useGetCategories } from '../../../api/hooks/category/category.api';

interface ProductFormProps {
  initialData?: ProductFormValues;
  onSuccess?: () => void;
}

export const ProductForm = ({ initialData, onSuccess }: ProductFormProps) => {
  const { data: categories } = useGetCategories();
  const { mutate: createProduct, isPending: isCreating, error: createError } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating, error: updateError } = useUpdateProduct();
  const [imageUrls, setImageUrls] = useState<string[]>(initialData?.images || []);

  const isUpdate = initialData ? isUpdateProduct(initialData) : false;
  const schema = isUpdate ? updateProductSchema : productBaseSchema;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      images: [],
      category_id: categories?.data?.[0]?.id || 0,
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        images: initialData.images || [],
      });
      setImageUrls(initialData.images || []);
    }
  }, [initialData, reset]);

  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    const payload = isUpdate 
      ? { ...data, id: (initialData as UpdateProductDto).id } 
      : data;

    const operation = isUpdate ? updateProduct : createProduct;
    
    operation(payload as any, {
      onSuccess: () => {
        onSuccess && onSuccess();
      },
    });
  };

  const handleAddImageUrl = (url: string) => {
    const newUrls = [...imageUrls, url];
    setImageUrls(newUrls);
    setValue('images', newUrls, { shouldValidate: true });
  };

  const handleRemoveImageUrl = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    setValue('images', newUrls, { shouldValidate: true });
  };

  const error = createError || updateError;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message || 'An error occurred'}
        </Alert>
      )}

      <TextField
        margin="normal"
        fullWidth
        label="Name"
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
        required
      />

      <TextField
        margin="normal"
        fullWidth
        label="Description"
        {...register('description')}
        error={!!errors.description}
        helperText={errors.description?.message}
        multiline
        rows={4}
        required
      />

      <TextField
        margin="normal"
        fullWidth
        label="Price"
        type="number"
        {...register('price', { valueAsNumber: true })}
        error={!!errors.price}
        helperText={errors.price?.message}
        required
      />

      <TextField
        margin="normal"
        fullWidth
        label="Stock"
        type="number"
        {...register('stock', { valueAsNumber: true })}
        error={!!errors.stock}
        helperText={errors.stock?.message}
        required
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <Select
              label="Category"
              {...field}
              error={!!errors.category_id}
              required
            >
              {categories?.data?.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Images</Typography>
        <TextField
          margin="normal"
          fullWidth
          label="Image URL"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const input = e.target as HTMLInputElement;
              if (input.value) {
                handleAddImageUrl(input.value);
                input.value = '';
              }
            }
          }}
        />
        <Box sx={{ mt: 1 }}>
          {imageUrls.map((url, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ mr: 1 }}>{url}</Typography>
              <Button 
                size="small" 
                color="error"
                onClick={() => handleRemoveImageUrl(index)}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Box>
        {errors.images && (
          <Typography color="error" variant="caption">
            {errors.images.message}
          </Typography>
        )}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isCreating || isUpdating}
          startIcon={isCreating || isUpdating ? <CircularProgress size={20} /> : null}
        >
          {isUpdate ? 'Update Product' : 'Create Product'}
        </Button>
      </Box>
    </Box>
  );
};