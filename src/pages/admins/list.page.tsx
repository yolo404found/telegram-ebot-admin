import { useState } from "react";
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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useDeleteAdmin, useGetAdmins } from "../../api/hooks/admin/admin.api";
import { AdminForm } from "./components";
import { FormDialog } from "../../components/form/FormDialog";

export const AdminList = () => {
  const { data: admins, isLoading, isError } = useGetAdmins();
  const { mutate: deleteAdmin } = useDeleteAdmin();
  const [selectedAdmin, setSelectedAdmin] = useState<number | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const handleDelete = (id: number | null) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this admin?")) {
      deleteAdmin(id);
    }
  };

  if (isLoading) return <CircularProgress />;
  if (isError)
    return <Typography color="error">Error loading admins</Typography>;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4">Admins</Typography>
        <Button
          variant="contained"
          onClick={() => {
            setSelectedAdmin(null);
            setOpenForm(true);
          }}
        >
          Add Admin
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Telegram ID</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins?.data?.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.phone || "-"}</TableCell>
                <TableCell>{admin.telegram_id}</TableCell>
                <TableCell>
                  <Chip
                    label={admin.is_owner ? "Owner" : "Admin"}
                    color={admin.is_owner ? "primary" : "default"}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedAdmin(admin.id ?? null);
                      setOpenForm(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(admin.id ?? null)}>
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
        title={selectedAdmin ? "Edit Admin" : "Create Admin"}
      >
        <AdminForm
          initialData={
            selectedAdmin
              ? admins?.data?.find(
                  (a) => a.id !== undefined && a.id === Number(selectedAdmin)
                )
              : undefined
          }
          onSuccess={() => {
            setOpenForm(false);
            setSelectedAdmin(null);
          }}
        />
      </FormDialog>
      {/* <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedAdmin ? 'Edit Admin' : 'Create Admin'}</DialogTitle>
        <DialogContent>
         
        </DialogContent>
      </Dialog> */}
    </Box>
  );
};
