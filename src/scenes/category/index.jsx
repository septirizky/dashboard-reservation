import React, { useState, useEffect } from "react";
import { Box, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { getCategoryGrist, postAllCategories } from "../../data/categoryData";

const CategoryData = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const branchCodes =
      JSON.parse(localStorage.getItem("userData")).branchCode || [];

    const fetchCategory = async () => {
      try {
        const categoryData = await getCategoryGrist(branchCodes);
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategory();
  }, []);

  const handlePostAll = async () => {
    if (!categories || categories.length === 0) {
      alert("No categories to post.");
      return;
    }

    try {
      const response = await postAllCategories({ categories });
      console.log("Data successfully posted:", response);
      alert("Data successfully posted to backend!");
    } catch (error) {
      console.error("Error posting data:", error);
      alert("Failed to post data to backend.");
    }
  };

  const columns = [
    {
      field: "CategoryItemID",
      headerName: "Category Item ID",
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
      field: "CategoryImage",
      headerName: "Url Image",
      flex: 2,
      headerAlign: "center",
    },
    {
      field: "CategoryThumbnail",
      headerName: "Thumbnail",
      flex: 1,
      renderCell: (params) => (
        <img
          src={params.row.CategoryThumbnail}
          alt="Thumbnail"
          style={{ width: "100px", height: "auto" }}
        />
      ),
      headerAlign: "center",
    },
  ];

  return (
    <Box m="20px">
      <Header title="CATEGORY" subtitle="Managing the Categories" />
      <Button
        variant="contained"
        color="secondary"
        onClick={handlePostAll}
        style={{ marginBottom: "20px" }}
      >
        Post All Categories to Backend
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
          rows={categories}
          columns={columns}
          getRowId={(row) => row.CategoryItemID}
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default CategoryData;
