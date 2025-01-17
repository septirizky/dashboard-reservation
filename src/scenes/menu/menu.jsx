import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  useTheme,
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
  createMenu,
  deleteMenu,
  getMenu,
  updateMenu,
  updateMenuToggle,
} from "../../data/menuData";
import { getCategory } from "../../data/categoryData";
import { toast, ToastContainer } from "react-toastify";

const Menu = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [menuForm, setMenuForm] = useState({
    CategoryId: "",
    CategoryName: "",
    i_id: "",
    MenusCode: "",
    MenuName: "",
    Description: "",
    MenuPrice: "",
    MenusKind: "",
    MenuPackage: false,
    MenusImage: null,
  });
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [searchParams] = useSearchParams();

  const handleModalOpen = () => setOpenCreateModal(true);
  const handleModalClose = () => {
    setOpenCreateModal(false);
    setMenuForm({
      CategoryName: "",
      i_id: "",
      MenusCode: "",
      MenuName: "",
      Description: "",
      MenuPrice: "",
      MenusKind: "",
      MenusImage: null,
    });
  };

  const fetchMenuAndCategory = async () => {
    const branchCodes =
      JSON.parse(localStorage.getItem("userData")).branchCode || [];

    try {
      const [menuData, categoryData] = await Promise.all([
        getMenu(branchCodes),
        getCategory(branchCodes),
      ]);

      const sortedMenuData = menuData.sort((a, b) =>
        a.CategoryName.localeCompare(b.CategoryName)
      );

      setMenus(sortedMenuData);
      setCategories(categoryData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const searchQuery = searchParams.get("search") || "";
    if (searchQuery) {
      const filteredData = menus.filter((menu) =>
        menu.MenuName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMenus(filteredData);
    } else {
      setFilteredMenus(menus);
    }
  }, [menus, searchParams]);

  useEffect(() => {
    fetchMenuAndCategory();
  }, []);

  const formatRupiah = (number) => {
    if (!number || isNaN(number)) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(number)
      .replace("Rp", "Rp ");
  };

  const BranchName = JSON.parse(localStorage.getItem("userData")).branchName;
  const BranchCode = JSON.parse(localStorage.getItem("userData")).branchCode;

  const handleToggleChange = async (id, field, value) => {
    setMenus((prevMenus) =>
      prevMenus.map((menu) =>
        menu.MenuId === id ? { ...menu, [field]: value } : menu
      )
    );

    try {
      await updateMenuToggle(id, { [field]: value });
    } catch (error) {
      console.error(`Failed to update ${field} for MenuId: ${id}`);
      toast.error("Failed to update toggle. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "CategoryName") {
      const selectedCategory = categories.find(
        (category) => category.CategoryName === value
      );
      setMenuForm((prev) => ({
        ...prev,
        [name]: value,
        CategoryId: selectedCategory ? selectedCategory.CategoryId : "",
      }));
    } else {
      setMenuForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setMenuForm((prev) => ({ ...prev, MenusImage: e.target.files[0] }));
  };

  const handleFormSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("BranchCode", BranchCode);
    formData.append("BranchName", BranchName);
    formData.append("CategoryId", menuForm.CategoryId);
    formData.append("CategoryName", menuForm.CategoryName);
    formData.append("MenusCode", menuForm.MenusCode);
    formData.append("MenuName", menuForm.MenuName);
    formData.append("Description", menuForm.Description);
    formData.append("MenuPrice", menuForm.MenuPrice);
    formData.append("MenusKind", menuForm.MenusKind);
    formData.append("i_id", parseInt(menuForm.i_id));
    formData.append("MenuPackage", menuForm.MenuPackage);
    formData.append("MenusImage", menuForm.MenusImage);

    try {
      await createMenu(formData);
      handleModalClose();
      toast.success("Menu created successfully!", { autoClose: 2000 });
      fetchMenuAndCategory();
    } catch (error) {
      console.error("Error creating menu:", error);
      toast.error(
        `Failed to create menu. Reason: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleEditClick = (menu) => {
    setEditingMenu(menu);
    setMenuForm({
      CategoryName: menu.CategoryName,
      i_id: menu.i_id,
      MenusCode: menu.MenusCode,
      MenuName: menu.MenuName,
      Description: menu.Description,
      MenuPrice: menu.MenuPrice,
      MenuPackage: menu.MenuPackage,
      MenusKind: menu.MenusKind,
    });
    setOpenEditModal(true);
  };

  const handleEditSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("BranchCode", BranchCode);
    formData.append("BranchName", BranchName);
    formData.append("CategoryId", menuForm.CategoryId);
    formData.append("CategoryName", menuForm.CategoryName);
    formData.append("MenusCode", menuForm.MenusCode);
    formData.append("MenuName", menuForm.MenuName);
    formData.append("Description", menuForm.Description);
    formData.append("MenuPrice", menuForm.MenuPrice);
    formData.append("MenusKind", menuForm.MenusKind);
    formData.append("i_id", parseInt(menuForm.i_id));
    formData.append("MenuPackage", menuForm.MenuPackage);
    if (menuForm.MenusImage) {
      formData.append("MenusImage", menuForm.MenusImage);
    }

    try {
      await updateMenu(editingMenu.MenuId, formData);
      setOpenEditModal(false);
      toast.success("Menu updated successfully!", { autoClose: 2000 });
      fetchMenuAndCategory();
    } catch (error) {
      console.error("Error updating menu:", error);
      toast.error(
        `Failed to update menu. Reason: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleDeleteClick = async (menuId) => {
    if (window.confirm("Are you sure you want to delete this menu?")) {
      try {
        await deleteMenu(menuId);
        toast.success("Menu deleted successfully!", { autoClose: 2000 });
        fetchMenuAndCategory();
      } catch (error) {
        console.error("Error deleting menu:", error);
        toast.error("Failed to delete menu.");
      }
    }
  };

  const columns = [
    {
      field: "CategoryName",
      headerName: "Category Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "MenuName",
      headerName: "Menu Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "Description",
      headerName: "Description",
      flex: 2,
      headerAlign: "center",
    },
    {
      field: "MenuPrice",
      headerName: "Menu Price",
      flex: 0.8,
      headerAlign: "center",
      align: "right",
      renderCell: (params) => formatRupiah(params.value),
    },
    {
      field: "MenuPackage",
      headerName: "Package",
      flex: 0.8,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Switch
          checked={params.row.MenuPackage}
          onChange={(e) =>
            handleToggleChange(
              params.row.MenuId,
              "MenuPackage",
              e.target.checked
            )
          }
          color={params.row.MenuPackage ? "secondary" : "default"}
        />
      ),
    },
    {
      field: "MenuSoldOut",
      headerName: "SoldOut",
      flex: 0.8,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Switch
          checked={params.row.MenuSoldOut}
          onChange={(e) =>
            handleToggleChange(
              params.row.MenuId,
              "MenuSoldOut",
              e.target.checked
            )
          }
          color={params.row.MenuSoldOut ? "secondary" : "default"}
        />
      ),
    },
    {
      field: "MenuShow",
      headerName: "Show",
      flex: 0.8,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Switch
          checked={params.row.MenuShow}
          onChange={(e) =>
            handleToggleChange(params.row.MenuId, "MenuShow", e.target.checked)
          }
          color={params.row.MenuShow ? "secondary" : "default"}
        />
      ),
    },
    {
      field: "MenuKind",
      headerName: "Menu Kind",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "MenuThumbnail",
      headerName: "Menu Image",
      flex: 1,
      renderCell: (params) => (
        <img
          src={params.row.MenuThumbnail}
          alt="MenusImage"
          style={{
            width: "100px",
            height: "100px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      ),
      headerAlign: "center",
      align: "center",
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
            onClick={() => handleDeleteClick(params.row.MenuId)}
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
      <Header title={`MENU ${BranchName}`} subtitle="Managing the Menu" />
      <Button variant="contained" color="secondary" onClick={handleModalOpen}>
        Create New Menu
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
          rows={filteredMenus}
          columns={columns}
          getRowId={(row) => row.MenuId}
          disableSelectionOnClick
          rowHeight={120}
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
          <h2>Create New Menu</h2>
          <Select
            fullWidth
            value={menuForm.CategoryName}
            name="CategoryName"
            onChange={handleInputChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Category
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.CategoryId} value={category.CategoryName}>
                {category.CategoryName}
              </MenuItem>
            ))}
          </Select>
          <Box display="flex" gap={2} marginTop={2}>
            <TextField
              fullWidth
              label="Item ID Ravintola"
              name="i_id"
              type="number"
              value={menuForm.i_id}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Menus Code"
              name="MenusCode"
              value={menuForm.MenusCode}
              onChange={handleInputChange}
            />
          </Box>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              margin="normal"
              label="Menu Name"
              name="MenuName"
              value={menuForm.MenuName}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Menu Price"
              name="MenuPrice"
              value={menuForm.MenuPrice}
              onChange={handleInputChange}
            />
          </Box>
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="Description"
            value={menuForm.Description}
            onChange={handleInputChange}
            multiline
            rows={4}
          />
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            marginTop={2}
            marginBottom={1}
          >
            <Select
              sx={{ flex: 2 }}
              value={menuForm.MenusKind}
              name="MenusKind"
              onChange={handleInputChange}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select Menu Kind
              </MenuItem>
              <MenuItem value="Food">Food</MenuItem>
              <MenuItem value="Beverages">Beverages</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>

            <Box display="flex" alignItems="center" gap={3} sx={{ flex: 1 }}>
              <Typography>Menu Package</Typography>
              <Switch
                checked={menuForm.MenuPackage}
                onChange={(e) =>
                  setMenuForm((prev) => ({
                    ...prev,
                    MenuPackage: e.target.checked,
                  }))
                }
                color="secondary"
              />
            </Box>
          </Box>
          <TextField
            fullWidth
            margin="normal"
            type="file"
            onChange={handleFileChange}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
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
          <h2>Edit Menu</h2>
          <Select
            fullWidth
            value={menuForm.CategoryName}
            name="CategoryName"
            onChange={handleInputChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Category
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.CategoryId} value={category.CategoryName}>
                {category.CategoryName}
              </MenuItem>
            ))}
          </Select>
          <Box display="flex" gap={2} marginTop={2}>
            <TextField
              fullWidth
              label="Item ID Ravintola"
              name="i_id"
              type="number"
              value={menuForm.i_id}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Menus Code"
              name="MenusCode"
              value={menuForm.MenusCode}
              onChange={handleInputChange}
            />
          </Box>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              margin="normal"
              label="Menu Name"
              name="MenuName"
              value={menuForm.MenuName}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Menu Price"
              name="MenuPrice"
              value={menuForm.MenuPrice}
              onChange={handleInputChange}
            />
          </Box>
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="Description"
            value={menuForm.Description}
            onChange={handleInputChange}
            multiline
            rows={4}
          />
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            marginTop={2}
            marginBottom={1}
          >
            <Select
              sx={{ flex: 2 }}
              value={menuForm.MenusKind}
              name="MenusKind"
              onChange={handleInputChange}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select Menu Kind
              </MenuItem>
              <MenuItem value="Food">Food</MenuItem>
              <MenuItem value="Beverages">Beverages</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>

            <Box display="flex" alignItems="center" gap={3} sx={{ flex: 1 }}>
              <Typography>Menu Package</Typography>
              <Switch
                checked={menuForm.MenuPackage}
                onChange={(e) =>
                  setMenuForm((prev) => ({
                    ...prev,
                    MenuPackage: e.target.checked,
                  }))
                }
                color="secondary"
              />
            </Box>
          </Box>
          <TextField
            fullWidth
            margin="normal"
            type="file"
            onChange={handleFileChange}
            sx={{ marginBottom: 2 }}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Modal>

      <ToastContainer />
    </Box>
  );
};

export default Menu;
