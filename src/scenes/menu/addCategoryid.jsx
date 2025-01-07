import React, { useState, useEffect } from "react";
import { Box, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { getMenu } from "../../data/menuData";
import { getCategory } from "../../data/categoryData";
import axios from "axios";

const AddCategoryid = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const branchCodes =
      JSON.parse(localStorage.getItem("userData")).branchCode || [];

    const fetchMenu = async () => {
      try {
        const menuData = await getMenu(branchCodes);
        setMenus(menuData);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    const fetchCategory = async () => {
      try {
        const categoryData = await getCategory(branchCodes);
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchMenu();
    fetchCategory();
  }, []);

  const handleUpdateCategoryId = async () => {
    try {
      const updatedMenus = menus.map((menu) => {
        const matchingCategory = categories.find(
          (category) => category.CategoryName === menu.CategoryName
        );

        return {
          ...menu,
          CategoryId: matchingCategory ? matchingCategory.CategoryId : "",
        };
      });

      // Update the backend
      const response = await axios.post(
        "http://127.0.0.1:5000/menu/update_category_id",
        { menus: updatedMenus }
      );
      console.log(response.data);

      alert("CategoryId successfully updated!");
      setMenus(updatedMenus); // Update local state
    } catch (error) {
      console.error("Error updating CategoryId:", error);
      alert("Failed to update CategoryId.");
    }
  };

  const columns = [
    {
      field: "MenuId",
      headerName: "Menu ID",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "BranchName",
      headerName: "Branch Name",
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
      flex: 2,
      headerAlign: "center",
    },
  ];

  return (
    <Box m="20px">
      <Header title="ADD CATEGORY ID DI MENU" subtitle="Managing the Menu" />
      <Button
        variant="contained"
        color="secondary"
        onClick={handleUpdateCategoryId}
        style={{ marginBottom: "20px" }}
      >
        Update CategoryId
      </Button>
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
          rows={menus}
          columns={columns}
          getRowId={(row) => row.MenuId}
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default AddCategoryid;
