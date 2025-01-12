/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Box, useTheme, Switch, Button, Modal, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import {
  getBranch,
  updateBranchData,
  updateBranchShow,
} from "../../data/branch";
import { toast, ToastContainer } from "react-toastify";

const Branch = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [branches, setBranches] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);

  const [menuForm, setMenuForm] = useState({
    branchPhone: "",
    branchEmail: "",
    branchAddress: "",
    branchMinimumPurchase: "",
  });

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(number)
      .replace("Rp", "Rp ");
  };

  const fetchBranches = async () => {
    try {
      const branchData = await getBranch();
      const transformedData = branchData.map((branch) => ({
        ...branch,
        branchMinimumPurchaseFormmated: formatRupiah(
          branch.branchMinimumPurchase || 0
        ),
      }));
      setBranches(transformedData);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMenuForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (menu) => {
    setEditingMenu(menu);
    setMenuForm({
      branchPhone: menu.branchPhone,
      branchEmail: menu.branchEmail,
      branchAddress: menu.branchAddress,
      branchMinimumPurchase: menu.branchMinimumPurchase,
    });
    setOpenEditModal(true);
  };

  const handleEditSubmit = async () => {
  const formData = new FormData();
  formData.append("branchPhone", menuForm.branchPhone);
  formData.append("branchEmail", menuForm.branchEmail);
  formData.append("branchAddress", menuForm.branchAddress);
  formData.append("branchMinimumPurchase", menuForm.branchMinimumPurchase);

  try {
    await updateBranchData(editingMenu.branchId, formData);
    setOpenEditModal(false);
    toast.success("Branch updated successfully!");
    fetchBranches();
  } catch (error) {
    console.error("Error updating branch:", error);
    toast.error(
      `Failed to update branch. Reason: ${
        error.response?.data?.errorMessage || error.message
      }`
    );
  }
};

  const handleToggleChange = async (id, field, value) => {
    setBranches((prevBranches) =>
      prevBranches.map((branch) =>
        branch.branchId === id ? { ...branch, [field]: value } : branch
      )
    );

    try {
      await updateBranchShow(id, { [field]: value });
    } catch (error) {
      console.error(`Failed to update ${field} for branchId: ${id}`);
      alert("Failed to update toggle. Please try again.");
    }
  };

  const columns = [
    {
      field: "branchName",
      headerName: "Branch Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "branchCode",
      headerName: "Branch Code",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "branchAddress",
      headerName: "Address",
      flex: 3,
      headerAlign: "center",
    },
    {
      field: "branchPhone",
      headerName: "Phone",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "branchEmail",
      headerName: "Email",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "branchMinimumPurchaseFormmated",
      headerName: "Minimum Purchase",
      flex: 0.6,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "branchShow",
      headerName: "Show",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => (
        <Switch
          checked={params.row.branchShow}
          onChange={(e) =>
            handleToggleChange(
              params.row.branchId,
              "branchShow",
              e.target.checked
            )
          }
          color={params.row.branchShow ? "secondary" : "default"}
        />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleEditClick(params.row)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="BRANCH" subtitle="Managing the Branch" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
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
          rows={branches}
          columns={columns}
          getRowId={(row) => row.branchId}
          disableSelectionOnClick
          rowHeight={120}
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
        />
      </Box>

      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
          }}
        >
          <h2>Edit Branch</h2>
          <TextField
            fullWidth
            label="Phone"
            name="branchPhone"
            value={menuForm.branchPhone}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            label="Email"
            name="branchEmail"
            value={menuForm.branchEmail}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            label="Address"
            name="branchAddress"
            value={menuForm.branchAddress}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            label="Minimum Purchase"
            name="branchMinimumPurchase"
            type="number"
            value={menuForm.branchMinimumPurchase}
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

export default Branch;
