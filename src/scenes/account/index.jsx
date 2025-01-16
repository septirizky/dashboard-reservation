import React, { useState, useEffect } from "react";
import { Box, useTheme, Button, Modal, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import {
  createAccount,
  deleteAccount,
  getAccounts,
  updateAccount,
} from "../../data/accountData";
import { toast, ToastContainer } from "react-toastify";

const Account = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [accounts, setAccounts] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [accountForm, setAccountForm] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
  });

  const handleModalOpen = () => setOpenCreateModal(true);
  const handleModalClose = () => {
    setOpenCreateModal(false);
    setAccountForm({
      bankName: "",
      accountNumber: "",
      accountHolder: "",
    });
  };

  const fetchAccount = async () => {
    try {
      const accountData = await getAccounts();
      setAccounts(accountData);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    const formData = new FormData();
    formData.append("bankName", accountForm.bankName);
    formData.append("accountNumber", accountForm.accountNumber);
    formData.append("accountHolder", accountForm.accountHolder);

    try {
      await createAccount(formData);
      handleModalClose();
      toast.success("Account created successfully!");
      fetchAccount();
    } catch (error) {
      console.error("Error creating Account:", error);
      toast.error(
        `Failed to create Account. Reason: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleEditClick = (account) => {
    setEditingAccount(account);
    setAccountForm({
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      accountHolder: account.accountHolder,
    });
    setOpenEditModal(true);
  };

  const handleEditSubmit = async () => {
    const updatedData = {
      bankName: accountForm.bankName,
      accountNumber: accountForm.accountNumber,
      accountHolder: accountForm.accountHolder,
    };

    try {
      await updateAccount(editingAccount.accountId, updatedData);
      setOpenEditModal(false);
      toast.success("Account updated successfully!");
      fetchAccount();
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error(
        `Failed to update account. Reason: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleDeleteClick = async (accountId) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        await deleteAccount(accountId);
        toast.success("Account deleted successfully!");
        fetchAccount();
      } catch (error) {
        console.error("Error deleting account:", error);
        toast.error("Failed to delete account.");
      }
    }
  };

  const columns = [
    {
      field: "bankName",
      headerName: "Bank Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "accountNumber",
      headerName: "Account Number",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "accountHolder",
      headerName: "Account Number Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={1}
          height="100%"
        >
          <Button
            onClick={() => handleEditClick(params.row)}
            sx={{
              color: "green",
              minWidth: "auto",
              padding: 0,
              height: "auto",
            }}
          >
            <EditIcon />
          </Button>
          <Button
            onClick={() => handleDeleteClick(params.row.accountId)}
            sx={{
              color: "red",
              minWidth: "auto",
              padding: 0,
              height: "auto",
            }}
          >
            <DeleteIcon />
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="ACCOUNT" subtitle="Managing the Account" />
      <Button variant="contained" color="secondary" onClick={handleModalOpen}>
        Create New Account
      </Button>
      <Box
        m="40px 0 0 0"
        height="70vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            display: "flex",
            fontSize: "0.9rem",
            fontWeight: "bold",
          },
        }}
      >
        <DataGrid
          rows={accounts}
          columns={columns}
          getRowId={(row) => row.accountId}
          disableSelectionOnClick
        />
      </Box>

      <Modal open={openCreateModal} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 900,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: "8px",
            boxShadow: 24,
          }}
        >
          <h2>Create New Account</h2>
          <TextField
            fullWidth
            margin="normal"
            label="Bank Name"
            name="bankName"
            value={accountForm.bankName}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Account Number"
            name="accountNumber"
            value={accountForm.accountNumber}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Account Holder"
            name="accountHolder"
            value={accountForm.accountHolder}
            onChange={handleInputChange}
          />

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="error"
              onClick={handleModalClose}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleFormSubmit}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 900,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: "8px",
            boxShadow: 24,
          }}
        >
          <h2>Edit Account</h2>
          <TextField
            fullWidth
            margin="normal"
            label="Bank Name"
            name="bankName"
            value={accountForm.bankName}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Account Number"
            name="accountNumber"
            value={accountForm.accountNumber}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Account Holder"
            name="accountHolder"
            value={accountForm.accountHolder}
            onChange={handleInputChange}
          />

          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenEditModal(false)}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleEditSubmit}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Modal>

      <ToastContainer />
    </Box>
  );
};

export default Account;
