import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import { adminFormSchema, AdminFormValues } from '../../../api/hooks/admin/admin.schema';
import { useCreateAdmin, useUpdateAdmin } from '../../../api/hooks/admin/admin.api';

interface AdminFormProps {
  initialData?: AdminFormValues;
  onSuccess?: () => void;
}

export const AdminForm = ({ initialData, onSuccess }: AdminFormProps) => {
  const { mutate: createAdmin, isPending: isCreating, error: createError } = useCreateAdmin();
  const { mutate: updateAdmin, isPending: isUpdating, error: updateError } = useUpdateAdmin();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<AdminFormValues>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      is_owner: false,
      telegram_id: '',
      name: '',
      phone: '',
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = (data: AdminFormValues) => {
    if (initialData?.id) {
      updateAdmin({ ...data, id: initialData.id }, { onSuccess });
    } else {
      const { password, ...rest } = data;
      createAdmin(
        { ...rest, password: password ?? '' },
        { onSuccess }
      );
    }
  };

  const error = createError || updateError;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2,height:200 }}>
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
      />

      {!initialData?.id && (
        <TextField
          margin="normal"
          fullWidth
          label="Password"
          type="password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          required
        />
      )}

      <TextField
        margin="normal"
        fullWidth
        label="Telegram ID"
        {...register('telegram_id')}
        error={!!errors.telegram_id}
        helperText={errors.telegram_id?.message}
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

     <Controller
  name="is_owner"
  control={control}
  render={({ field }) => (
    <FormControlLabel
      control={
        <Checkbox
          checked={field.value}
          onChange={(e) => field.onChange(e.target.checked)}
        />
      }
      label="Is Owner"
    />
  )}
/>

      <Box sx={{ mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isCreating || isUpdating}
          startIcon={isCreating || isUpdating ? <CircularProgress size={20} /> : null}
        >
          {initialData?.id ? 'Update Admin' : 'Create Admin'}
        </Button>
      </Box>
    </Box>
  );
};