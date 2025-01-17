import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Button, Modal, Switch, TextField, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import {
  createCategory,
  deleteCategory,
  getCategory,
  updateCategory,
  updateCategoryToggle,
} from "../../data/categoryData";
import { toast, ToastContainer } from "react-toastify";

const Category = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [categories, setCategories] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    CategoryName: "",
    Order: "",
    CategoryImage: null,
  });
  const [filteredCategory, setFilteredCategory] = useState([]);
  const [searchParams] = useSearchParams();

  const handleModalOpen = () => setOpenCreateModal(true);
  const handleModalClose = () => {
    setOpenCreateModal(false);
    setCategoryForm({
      CategoryName: "",
      Order: "",
      CategoryImage: null,
    });
  };

  const fetchCategory = async () => {
    const branchCodes =
      JSON.parse(localStorage.getItem("userData")).branchCode || [];
    try {
      const categoryData = await getCategory(branchCodes);
      setCategories(categoryData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    const searchQuery = searchParams.get("search") || "";
    if (searchQuery) {
      const filteredData = categories.filter((category) =>
        category.CategoryName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategory(filteredData);
    } else {
      setFilteredCategory(categories);
    }
  }, [categories, searchParams]);

  useEffect(() => {
    fetchCategory();
  }, []);

  const BranchName = JSON.parse(localStorage.getItem("userData")).branchName;
  const BranchCode = JSON.parse(localStorage.getItem("userData")).branchCode;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setCategoryForm((prev) => ({ ...prev, CategoryImage: e.target.files[0] }));
  };

  const handleFormSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("BranchCode", BranchCode);
    formData.append("BranchName", BranchName);
    formData.append("CategoryName", categoryForm.CategoryName);
    formData.append("Order", categoryForm.Order);
    formData.append("CategoryImage", categoryForm.CategoryImage);

    try {
      await createCategory(formData);
      handleModalClose();
      toast.success("Category created successfully!", { autoClose: 2000 });
      fetchCategory();
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(
        `Failed to create category. Reason: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleChange = async (id, field, value) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.CategoryId === id ? { ...category, [field]: value } : category
      )
    );

    try {
      await updateCategoryToggle(id, { [field]: value });
    } catch (error) {
      console.error(`Failed to update ${field} for CategoryId: ${id}`);
      toast.error("Failed to update toggle. Please try again.");
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      CategoryName: category.CategoryName,
      Order: category.Order,
    });
    setOpenEditModal(true);
  };

  const handleEditSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("BranchCode", BranchCode);
    formData.append("BranchName", BranchName);
    formData.append("CategoryName", categoryForm.CategoryName);
    formData.append("Order", categoryForm.Order);
    if (categoryForm.CategoryImage) {
      formData.append("CategoryImage", categoryForm.CategoryImage);
    }

    try {
      await updateCategory(editingCategory.CategoryId, formData);
      setOpenEditModal(false);
      toast.success("Category updated successfully!", { autoClose: 2000 });
      fetchCategory();
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(
        `Failed to update category. Reason: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(categoryId);
        toast.success("Category deleted successfully!", { autoClose: 2000 });
        fetchCategory();
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Failed to delete category.");
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
      field: "CategoryName",
      headerName: "Category Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "Order",
      headerName: "Order",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "CategoryShow",
      headerName: "Show",
      flex: 0.8,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Switch
          checked={params.row.CategoryShow}
          onChange={(e) =>
            handleToggleChange(
              params.row.CategoryId,
              "CategoryShow",
              e.target.checked
            )
          }
          color={params.row.CategoryShow ? "secondary" : "default"}
        />
      ),
    },
    {
      field: "CategoryThumbnail",
      headerName: "Category Image",
      flex: 1,
      renderCell: (params) => (
        <img
          src={params.row.CategoryThumbnail}
          alt="CategoryImage"
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
            onClick={() => handleDeleteClick(params.row.CategoryId)}
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
        title={`CATEGORY MENU ${BranchName}`}
        subtitle="Managing the Categories"
      />
      <Button variant="contained" color="secondary" onClick={handleModalOpen}>
        Create New Category
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
          rows={filteredCategory}
          columns={columns}
          getRowId={(row) => row.CategoryId}
          disableSelectionOnClick
          rowHeight={120}
          sortModel={[{ field: "Order", sort: "asc" }]}
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
          <h2>Create New Category</h2>
          <TextField
            fullWidth
            margin="normal"
            label="Category Name"
            name="CategoryName"
            value={categoryForm.CategoryName}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Order"
            name="Order"
            value={categoryForm.Order}
            type="number"
            onChange={handleInputChange}
          />
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
          <h2>Edit Category</h2>
          <TextField
            fullWidth
            margin="normal"
            label="Category Name"
            name="CategoryName"
            value={categoryForm.CategoryName}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Order"
            name="Order"
            value={categoryForm.Order}
            type="number"
            onChange={handleInputChange}
          />
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

export default Category;
