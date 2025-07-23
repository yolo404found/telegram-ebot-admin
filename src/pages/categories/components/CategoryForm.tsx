import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categoryBaseSchema, CategoryFormValues } from '../../../api/hooks/category/category.schema';
import { useCreateCategory, useUpdateCategory } from '../../../api/hooks/category/category.api';
import { useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';

interface CategoryFormProps {
  initialData?: CategoryFormValues;
  onSuccess?: () => void;
}

export const CategoryForm = ({ initialData, onSuccess }: CategoryFormProps) => {
  const { mutate: createCategory, isPending: isCreating, error: createError } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating, error: updateError } = useUpdateCategory();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryBaseSchema),
    defaultValues: {
      name: '',
      description: '',
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = (data: CategoryFormValues) => {
    if (initialData?.id) {
      updateCategory({ ...data, id: initialData.id }, { onSuccess });
    } else {
      createCategory(data, { onSuccess });
    }
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
      />

      <Box sx={{ mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isCreating || isUpdating}
          startIcon={isCreating || isUpdating ? <CircularProgress size={20} /> : null}
        >
          {initialData?.id ? 'Update Category' : 'Create Category'}
        </Button>
      </Box>
    </Box>
  );
};