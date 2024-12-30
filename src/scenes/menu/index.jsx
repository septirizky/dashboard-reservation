import React, { useState, useEffect } from "react";
import { Box, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { getMenu, postAllMenu } from "../../data/menuData";

const MenuData = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [menus, setMenus] = useState([]);

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

    fetchMenu();
  }, []);

  const handlePostAll = async () => {
    if (!menus || menus.length === 0) {
      alert("No menu to post.");
      return;
    }

    try {
      const response = await postAllMenu(menus); // Langsung kirimkan array `menu`
      console.log("Data successfully posted:", response);
      alert("Data successfully posted to backend!");
    } catch (error) {
      console.error("Error posting data:", error);
      alert("Failed to post data to backend.");
    }
  };

  const columns = [
    {
      field: "MenusID",
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
      field: "MenuName",
      headerName: "Menu Name",
      flex: 2,
      headerAlign: "center",
    },
    {
      field: "MenusImage",
      headerName: "Menu Image",
      flex: 2,
      headerAlign: "center",
    },
    {
      field: "MenuThumbnail",
      headerName: "Thumbnail",
      flex: 1,
      renderCell: (params) => (
        <img
          src={params.row.MenuThumbnail}
          alt="Thumbnail"
          style={{ width: "100px", height: "auto" }}
        />
      ),
      headerAlign: "center",
    },
  ];

  return (
    <Box m="20px">
      <Header title="MENU" subtitle="Managing the Menu" />
      <Button
        variant="contained"
        color="secondary"
        onClick={handlePostAll}
        style={{ marginBottom: "20px" }}
      >
        Post All Menu to Backend
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
          getRowId={(row) => row.MenusID}
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default MenuData;
