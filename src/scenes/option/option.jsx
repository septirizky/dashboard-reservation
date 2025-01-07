import React, { useState, useEffect } from "react";
import { Box, useTheme, Button, Modal, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import {
  createOption,
  deleteOption,
  getOption,
  updateOption,
} from "../../data/optionData";
import { toast, ToastContainer } from "react-toastify";

const Option = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [options, setOptions] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingOption, setEditingOption] = useState(null);

  const [optionForm, setOptionForm] = useState({
    OptionCategoryText: "",
    OptionCode: "",
    OptionName: "",
    op_id: "",
  });

  const handleModalOpen = () => setOpenCreateModal(true);
  const handleModalClose = () => {
    setOpenCreateModal(false);
    setOptionForm({
      OptionCategoryText: "",
      OptionCode: "",
      OptionName: "",
      op_id: "",
    });
  };

  const fetchOption = async () => {
    const branchCodes =
      JSON.parse(localStorage.getItem("userData")).branchCode || [];
    try {
      const optionData = await getOption(branchCodes);
      setOptions(optionData);
    } catch (error) {
      console.error("Error fetching option:", error);
    }
  };

  useEffect(() => {
    fetchOption();
  }, []);

  const BranchName = JSON.parse(localStorage.getItem("userData")).branchName;
  const BranchCode = JSON.parse(localStorage.getItem("userData")).branchCode;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOptionForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    const formData = new FormData();
    formData.append("BranchCode", BranchCode);
    formData.append("BranchName", BranchName);
    formData.append("OptionCategoryText", optionForm.OptionCategoryText);
    formData.append("OptionCode", optionForm.OptionCode);
    formData.append("OptionName", optionForm.OptionName);
    formData.append("op_id", parseInt(optionForm.op_id));

    try {
      await createOption(formData);
      handleModalClose();
      toast.success("Option created successfully!");
      fetchOption();
    } catch (error) {
      console.error("Error creating option:", error);
      toast.error(
        `Failed to create option. Reason: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleEditClick = (option) => {
    setEditingOption(option);
    setOptionForm({
      OptionCategoryText: option.OptionCategoryText,
      OptionCode: option.OptionCode,
      OptionName: option.OptionName,
      op_id: option.op_id,
    });
    setOpenEditModal(true);
  };

  const handleEditSubmit = async () => {
    const formData = new FormData();
    formData.append("BranchCode", BranchCode);
    formData.append("BranchName", BranchName);
    formData.append("OptionCategoryText", optionForm.OptionCategoryText);
    formData.append("OptionCode", optionForm.OptionCode);
    formData.append("OptionName", optionForm.OptionName);
    formData.append("op_id", parseInt(optionForm.op_id));

    try {
      await updateOption(editingOption.OptionId, formData);
      setOpenEditModal(false);
      toast.success("Option updated successfully!");
      fetchOption();
    } catch (error) {
      console.error("Error updating option:", error);
      toast.error(
        `Failed to update option. Reason: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleDeleteClick = async (optionId) => {
    if (window.confirm("Are you sure you want to delete this option?")) {
      try {
        await deleteOption(optionId);
        toast.success("Option deleted successfully!");
        fetchOption();
      } catch (error) {
        console.error("Error deleting option:", error);
        toast.error("Failed to delete option.");
      }
    }
  };

  const columns = [
    {
      field: "OptionCategoryText",
      headerName: "Category Text",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "OptionCode",
      headerName: "Option Code",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "OptionName",
      headerName: "Option Name",
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
            onClick={() => handleDeleteClick(params.row.OptionId)}
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
      <Header
        title={` OPTION MENU ${BranchName}`}
        subtitle="Managing the Option"
      />
      <Button variant="contained" color="secondary" onClick={handleModalOpen}>
        Create New Option
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
          rows={options}
          columns={columns}
          getRowId={(row) => row.OptionId}
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
          <h2>Create New Option</h2>
          <TextField
            fullWidth
            margin="normal"
            label="Option ID Ravintola"
            name="op_id"
            type="number"
            value={optionForm.op_id}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Option Category Text"
            name="OptionCategoryText"
            value={optionForm.OptionCategoryText}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Option Code"
            name="OptionCode"
            value={optionForm.OptionCode}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Option Name"
            name="OptionName"
            value={optionForm.OptionName}
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
          <h2>Edit Option</h2>
          <TextField
            fullWidth
            margin="normal"
            label="Option ID Ravintola"
            name="op_id"
            type="number"
            value={optionForm.op_id}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Option Category Text"
            name="OptionCategoryText"
            value={optionForm.OptionCategoryText}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Option Code"
            name="OptionCode"
            value={optionForm.OptionCode}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Option Name"
            name="OptionName"
            value={optionForm.OptionName}
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

export default Option;
