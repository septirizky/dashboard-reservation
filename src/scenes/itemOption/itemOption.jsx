import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Button,
  Select,
  MenuItem,
  Modal,
  List,
  ListItem,
  Checkbox,
  ListItemText,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import {
  createItemOption,
  deleteItemOption,
  getItemOption,
} from "../../data/itemOptionData";
import { toast, ToastContainer } from "react-toastify";
import { getCategory } from "../../data/categoryData";
import { getMenu } from "../../data/menuData";
import { getOption } from "../../data/optionData";

const ItemOption = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [itemOptions, setItemOptions] = useState([]);
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [options, setOptions] = useState([]);
  const [searchMenu, setSearchMenu] = useState("");
  const [searchOption, setSearchOption] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [itemOptionForm, setItemOptionForm] = useState({
    mode: "Category",
    selectedItems: [],
    selectedOptions: [],
  });

  const handleModalOpen = () => setOpenCreateModal(true);
  const handleModalClose = () => {
    setOpenCreateModal(false);
    setItemOptionForm({
      mode: "Category",
      selectedItems: [],
      selectedOptions: [],
    });
  };

  const fetchAll = async () => {
    const branchCodes =
      JSON.parse(localStorage.getItem("userData")).branchCode || [];
    try {
      const [itemOptionData, categoryData, menuData, optionData] =
        await Promise.all([
          getItemOption(branchCodes),
          getCategory(branchCodes),
          getMenu(branchCodes),
          getOption(branchCodes),
        ]);

      setItemOptions(itemOptionData);
      setCategories(categoryData);
      setMenus(menuData);
      setOptions(optionData);
    } catch (error) {
      console.error("Error fetching option:", error);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const BranchCode = JSON.parse(localStorage.getItem("userData")).branchCode;
  const BranchName = JSON.parse(localStorage.getItem("userData")).branchName;

  const handleSubmit = async () => {
    if (!itemOptionForm.selectedItems.length) {
      toast.error("Pilih setidaknya satu item!");
      return;
    }

    try {
      const selectedItemId = itemOptionForm.selectedItems[0];
      const existingOptions = itemOptions
        .filter((option) => option.MenuId === selectedItemId)
        .map((opt) => opt.OptionId);

      const optionsToAdd = itemOptionForm.selectedOptions.filter(
        (opt) => !existingOptions.includes(opt)
      );

      const optionsToDelete = existingOptions.filter(
        (opt) => !itemOptionForm.selectedOptions.includes(opt)
      );

      const dataToAdd = optionsToAdd.map((optionId) => {
        const option = options.find((opt) => opt.OptionId === optionId);
        const item = menus.find((menu) => menu.MenuId === selectedItemId);

        return {
          BranchCode: BranchCode.toString(),
          BranchName: BranchName.toString(),
          MenuId: item.MenuId,
          MenuName: item.MenuName,
          OptionId: option.OptionId,
          OptionName: option.OptionName,
          OptionCategoryText: option.OptionCategoryText,
          op_id: option.op_id,
          ItemOptionShow: true,
        };
      });

      if (dataToAdd.length > 0) {
        await createItemOption(dataToAdd);
      }

      if (optionsToDelete.length > 0) {
        for (const optionId of optionsToDelete) {
          const itemOptionId = itemOptions.find(
            (opt) => opt.MenuId === selectedItemId && opt.OptionId === optionId
          ).ItemOptionId;

          await deleteItemOption(itemOptionId);
        }
      }

      toast.success("Item Option updated successfully!");
      fetchAll();
      handleModalClose();
    } catch (error) {
      console.error("Error saving item option:", error);
      toast.error(
        `Failed to save item option. Reason: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleDeleteClick = async (itemOptionId) => {
    if (window.confirm("Are you sure you want to delete this item option?")) {
      try {
        await deleteItemOption(itemOptionId);
        toast.success("Item Option deleted successfully!");
        fetchAll();
      } catch (error) {
        console.error("Error deleting item option:", error);
        toast.error("Failed to delete item option.");
      }
    }
  };

  const handleSelectItem = async (itemId) => {
    const selectedItem =
      itemOptionForm.mode === "Category"
        ? categories.find((cat) => cat.CategoryId === itemId)
        : menus.find((menu) => menu.MenuId === itemId);

    setItemOptionForm((prev) => ({
      ...prev,
      selectedItems: [itemId],
      selectedOptions: [],
    }));

    try {
      const existingOptions = await getItemOption(
        JSON.parse(localStorage.getItem("userData")).branchCode
      );

      const relatedOptions = existingOptions.filter(
        (option) =>
          (itemOptionForm.mode === "Category" &&
            option.CategoryId === selectedItem.CategoryId) ||
          (itemOptionForm.mode === "Menu" &&
            option.MenuId === selectedItem.MenuId)
      );

      const relatedOptionIds = relatedOptions.map((opt) => opt.OptionId);

      setItemOptionForm((prev) => ({
        ...prev,
        selectedOptions: relatedOptionIds,
      }));
    } catch (error) {
      console.error("Error fetching existing options:", error);
      toast.error("Failed to fetch related options.");
    }
  };

  const handleSelectOption = (optionId) => {
    setItemOptionForm((prev) => ({
      ...prev,
      selectedOptions: prev.selectedOptions?.includes(optionId)
        ? prev.selectedOptions.filter((id) => id !== optionId)
        : [...(prev.selectedOptions || []), optionId],
    }));
  };

  const filteredMenus =
    itemOptionForm.mode === "Category"
      ? categories.filter((cat) =>
          cat.CategoryName.toLowerCase().includes(searchMenu.toLowerCase())
        )
      : menus.filter((menu) =>
          menu.MenuName.toLowerCase().includes(searchMenu.toLowerCase())
        );

  const filteredOptions = options.filter((option) =>
    option.OptionName.toLowerCase().includes(searchOption.toLowerCase())
  );

  useEffect(() => {
    setItemOptionForm((prev) => ({
      ...prev,
      selectedItems: [],
      selectedOptions: [],
    }));
  }, [itemOptionForm.mode]);

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
      field: "OptionText",
      headerName: "Category Text",
      flex: 1,
      headerAlign: "center",
    },
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
            onClick={() => handleDeleteClick(params.row.ItemOptionId)}
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
      <Header title=" ITEM OPTION" subtitle="Managing the Item Option" />
      <Button variant="contained" color="secondary" onClick={handleModalOpen}>
        Set Item Option
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
          rows={itemOptions}
          columns={columns}
          getRowId={(row) => row.ItemOptionId}
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
          <h2>Create New Item Option</h2>
          <Select
            value={itemOptionForm.mode}
            onChange={(e) => {
              const mode = e.target.value;
              setItemOptionForm({
                mode,
                selectedItems: [],
                selectedOptions: [],
              });
            }}
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="Category">Category</MenuItem>
            <MenuItem value="Menu">Menu</MenuItem>
          </Select>

          <Box display="flex" gap={2}>
            {/* Kolom Menu atau Category */}
            <Box
              sx={{
                width: "45%",
                maxHeight: 500,
                overflow: "auto",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <TextField
                placeholder={`Search ${
                  itemOptionForm.mode === "Category" ? "Categories" : "Menus"
                }`}
                value={searchMenu}
                onChange={(e) => setSearchMenu(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <List>
                {filteredMenus.map((item) => {
                  const itemId =
                    itemOptionForm.mode === "Category"
                      ? item.CategoryId
                      : item.MenuId;

                  return (
                    <ListItem
                      key={itemId}
                      button
                      onClick={() => handleSelectItem(itemId)}
                    >
                      <Checkbox
                        checked={itemOptionForm.selectedItems.includes(itemId)}
                        color="secondary"
                      />
                      <ListItemText
                        primary={
                          itemOptionForm.mode === "Category"
                            ? item.CategoryName
                            : item.MenuName
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Box>

            {/* Kolom Options */}
            <Box
              sx={{
                width: "45%",
                maxHeight: 500,
                overflow: "auto",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <TextField
                placeholder="Search Options"
                value={searchOption}
                onChange={(e) => setSearchOption(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <List>
                {filteredOptions.map((option) => (
                  <ListItem
                    key={option.OptionId}
                    button
                    onClick={() => handleSelectOption(option.OptionId)}
                  >
                    <Checkbox
                      checked={itemOptionForm.selectedOptions.includes(
                        option.OptionId
                      )}
                      color="secondary"
                    />
                    <ListItemText primary={option.OptionName} />
                  </ListItem>
                ))}
              </List>
            </Box>
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
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      <ToastContainer />
    </Box>
  );
};

export default ItemOption;
