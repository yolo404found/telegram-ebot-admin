import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
  MenuItem,
} from '@mui/material';
import { customerFormSchema, CustomerFormValues } from '../../../api/hooks/customer/customer.schema';
import { useCreateCustomer, useUpdateCustomer } from '../../../api/hooks/customer/customer.api';

interface CustomerFormProps {
  initialData?: CustomerFormValues;
  onSuccess?: () => void;
}

export const CustomerForm = ({ initialData, onSuccess }: CustomerFormProps) => {
  const { mutate: createCustomer, isPending: isCreating, error: createError } = useCreateCustomer();
  const { mutate: updateCustomer, isPending: isUpdating, error: updateError } = useUpdateCustomer();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      customer_type: 'normal',
      phone: '',
      name: '',
      address: '',
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        customer_type: initialData.customer_type ?? 'normal',
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data: CustomerFormValues) => {
    if (initialData?.id) {
      updateCustomer({ ...data, id: initialData.id }, { onSuccess });
    } else {
      createCustomer(data, { onSuccess });
    }
  };

  const error = createError || updateError;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2, height: 400 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message || 'An error occurred'}
        </Alert>
      )}

      <TextField
        margin="normal"
        fullWidth
        label="Phone"
        {...register('phone')}
        error={!!errors.phone}
        helperText={errors.phone?.message}
        required
      />

      <TextField
        margin="normal"
        fullWidth
        label="Full Name"
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
        required
      />

      <TextField
        margin="normal"
        fullWidth
        label="Address"
        {...register('address')}
        error={!!errors.address}
        helperText={errors.address?.message}
        required
      />

      <Controller
        name="customer_type"
        control={control}
        defaultValue="normal"
        render={({ field }) => (
          <TextField
            select
            margin="normal"
            fullWidth
            label="Customer Type"
            value={field.value}
            onChange={field.onChange}
          >
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="VIP">VIP</MenuItem>
          </TextField>
        )}
      />

      <Box sx={{ mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isCreating || isUpdating}
          startIcon={isCreating || isUpdating ? <CircularProgress size={20} /> : null}
        >
          {initialData?.id ? 'Update Customer' : 'Create Customer'}
        </Button>
      </Box>
    </Box>
  );
};