import { Close } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, Box, Button } from '@mui/material';
import { ReactNode } from 'react';

interface FormDialogProps<T> {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

export function FormDialog<T>({
  open,
  onClose,
  title,
  children,
  maxWidth = 'md',
  fullWidth = true,
}: FormDialogProps<T>) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      sx={{
        "& .MuiDialog-paper": {
          minHeight: "540px",
          py:2
        },
      }}
      fullWidth={fullWidth}
    >
      <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",pr:4}}>
        <DialogTitle>{title}</DialogTitle>
        <Button onClick={onClose}>
          <Close color='error'/>
        </Button>
      </Box>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}