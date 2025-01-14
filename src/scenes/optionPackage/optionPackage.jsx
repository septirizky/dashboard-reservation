import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Button,
  Switch,
  TextField,
  Modal,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import {
  createOptionPackage,
  deleteOptionPackage,
  getOptionPackage,
  updateMenuToggle,
  updateOptionPackage,
} from "../../data/optionPackageData";
import { toast, ToastContainer } from "react-toastify";
import { getMenu } from "../../data/menuData";

const OptionPackage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [optionPackages, setOptionPackages] = useState([]);
  const [menus, setMenus] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingOption, setEditingOption] = useState(null);

  const [optionForm, setOptionForm] = useState({
    MenuPackageName: "",
    OptionPackageName: "",
    MaxChoosen: "",
    MinChoosen: "",
    AutoInsert: false,
  });

  const handleModalOpen = () => setOpenCreateModal(true);
  const handleModalClose = () => {
    setOpenCreateModal(false);
    setOptionForm({
      MenuPackageName: "",
      OptionPackageName: "",
      MaxChoosen: "",
      MinChoosen: "",
      AutoInsert: false,
    });
  };

  const fetchOptionPackageAndMenu = async () => {
    const branchCodes =
      JSON.parse(localStorage.getItem("userData")).branchCode || [];
    try {
      const [optionPackageData, menuData] = await Promise.all([
        getOptionPackage(branchCodes),
        getMenu(branchCodes),
      ]);

      const filteredMenuData = menuData.filter(
        (menu) => menu.MenuPackage === true
      );

      setOptionPackages(optionPackageData);
      setMenus(filteredMenuData);
    } catch (error) {
      console.error("Error fetching option:", error);
    }
  };

  useEffect(() => {
    fetchOptionPackageAndMenu();
  }, []);

  const BranchName = JSON.parse(localStorage.getItem("userData")).branchName;
  const BranchCode = JSON.parse(localStorage.getItem("userData")).branchCode;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "MenuPackageName") {
      const selectedMenu = menus.find((menu) => menu.MenuName === value);
      setOptionForm((prev) => ({
        ...prev,
        [name]: value,
        MenuId: selectedMenu ? selectedMenu.MenuId : "",
      }));
    } else {
      setOptionForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleToggleChange = async (id, field, value) => {
    setOptionPackages((prevOptionPackage) =>
      prevOptionPackage.map((optionPackage) =>
        optionPackage.OptionPackageId === id
          ? { ...optionPackage, [field]: value }
          : optionPackage
      )
    );

    try {
      await updateMenuToggle(id, { [field]: value });
    } catch (error) {
      console.error(`Failed to update ${field} for OptionPackageId: ${id}`);
      alert("Failed to update toggle. Please try again.");
    }
  };

  const handleFormSubmit = async () => {
    const formData = new FormData();
    formData.append("BranchCode", BranchCode);
    formData.append("BranchName", BranchName);
    formData.append("MenuPackageName", optionForm.MenuPackageName);
    formData.append("OptionPackageName", optionForm.OptionPackageName);
    formData.append("MaxChoosen", optionForm.MaxChoosen);
    formData.append("MinChoosen", optionForm.MinChoosen);
    formData.append("AutoInsert", optionForm.AutoInsert);

    try {
      await createOptionPackage(formData);
      handleModalClose();
      toast.success("Option package created successfully!");
      fetchOptionPackageAndMenu();
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
      MenuPackageName: option.MenuPackageName,
      OptionPackageName: option.OptionPackageName,
      MaxChoosen: option.MaxChoosen,
      MinChoosen: option.MinChoosen,
      AutoInsert: option.AutoInsert,
    });
    setOpenEditModal(true);
  };

  const handleEditSubmit = async () => {
    const formData = new FormData();
    formData.append("BranchCode", BranchCode);
    formData.append("BranchName", BranchName);
    formData.append("MenuPackageName", optionForm.MenuPackageName);
    formData.append("OptionPackageName", optionForm.OptionPackageName);
    formData.append("MaxChoosen", optionForm.MaxChoosen);
    formData.append("MinChoosen", optionForm.MinChoosen);
    formData.append("AutoInsert", optionForm.AutoInsert);

    try {
      await updateOptionPackage(editingOption.OptionPackageId, formData);
      setOpenEditModal(false);
      toast.success("Option updated successfully!");
      fetchOptionPackageAndMenu();
    } catch (error) {
      console.error("Error updating option:", error);
      toast.error(
        `Failed to update option. Reason: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleDeleteClick = async (optionPackageId) => {
    if (window.confirm("Are you sure you want to delete this option?")) {
      try {
        await deleteOptionPackage(optionPackageId);
        toast.success("Option deleted successfully!");
        fetchOptionPackageAndMenu();
      } catch (error) {
        console.error("Error deleting option:", error);
        toast.error("Failed to delete option.");
      }
    }
  };

  const columns = [
    {
      field: "BranchName",
      headerName: "Branch Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "BranchCode",
      headerName: "Branch Code",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "MenuPackageName",
      headerName: "Menu Package Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "OptionPackageName",
      headerName: "Option Package Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "MaxChoosen",
      headerName: "Max Choosen",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "MinChoosen",
      headerName: "Min Choosen",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "AuotoInsert",
      headerName: "Auto Insert",
      flex: 0.8,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Switch
          checked={params.row.AutoInsert}
          onChange={(e) =>
            handleToggleChange(
              params.row.OptionPackageId,
              "AutoInsert",
              e.target.checked
            )
          }
          color={params.row.AutoInsert ? "secondary" : "default"}
        />
      ),
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
            onClick={() => handleDeleteClick(params.row.OptionPackageId)}
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
        title={`OPTION PACKAGE  ${BranchName}`}
        subtitle="Managing the Option Package"
      />
      <Button variant="contained" color="secondary" onClick={handleModalOpen}>
        Create New Option Package
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
          rows={optionPackages}
          columns={columns}
          getRowId={(row) => row.OptionPackageId}
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
          <h2>Create New Option Package</h2>
          <Select
            fullWidth
            value={optionForm.MenuPackageName}
            name="MenuPackageName"
            onChange={handleInputChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Menu
            </MenuItem>
            {menus.map((menu) => (
              <MenuItem key={menu.MenuId} value={menu.MenuName}>
                {menu.MenuName}
              </MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            margin="normal"
            label="Category Label Name"
            name="OptionPackageName"
            value={optionForm.OptionPackageName}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Max Choose"
            name="MaxChoosen"
            value={optionForm.MaxChoosen}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Min Choose"
            name="MinChoosen"
            value={optionForm.MinChoosen}
            onChange={handleInputChange}
          />
          <Box display="flex" alignItems="center" gap={3} sx={{ flex: 1 }}>
            <Typography>Auto Insert</Typography>
            <Switch
              checked={optionForm.AutoInsert}
              onChange={(e) =>
                setOptionForm((prev) => ({
                  ...prev,
                  AutoInsert: e.target.checked,
                }))
              }
              color="secondary"
            />
          </Box>

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
          <Select
            fullWidth
            value={optionForm.MenuPackageName}
            name="MenuPackageName"
            onChange={handleInputChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Menu
            </MenuItem>
            {menus.map((menu) => (
              <MenuItem key={menu.MenuId} value={menu.MenuName}>
                {menu.MenuName}
              </MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            margin="normal"
            label="Category Label Name"
            name="OptionPackageName"
            value={optionForm.OptionPackageName}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Max Choose"
            name="MaxChoosen"
            value={optionForm.MaxChoosen}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Min Choose"
            name="MinChoosen"
            value={optionForm.MinChoosen}
            onChange={handleInputChange}
          />
          <Box display="flex" alignItems="center" gap={3} sx={{ flex: 1 }}>
            <Typography>Menu Package</Typography>
            <Switch
              checked={optionForm.AutoInsert}
              onChange={(e) =>
                setOptionForm((prev) => ({
                  ...prev,
                  AutoInsert: e.target.checked,
                }))
              }
              color="secondary"
            />
          </Box>

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

export default OptionPackage;
