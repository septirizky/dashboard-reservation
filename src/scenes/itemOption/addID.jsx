import Header from "../../components/Header";
import React, { useState, useEffect } from "react";
import { Box, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { getItemOption, updateItemOptions } from "../../data/itemOptionData";
import { getMenu } from "../../data/menuData";
import { getOption } from "../../data/optionData";

const AddIDdiItemOption = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [itemOptions, setItemOptions] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [optionData, setOptionData] = useState([]);

  useEffect(() => {
    const branchCodes =
      JSON.parse(localStorage.getItem("userData")).branchCode || [];

    const fetchData = async () => {
      try {
        const [itemOptionData, menus, options] = await Promise.all([
          getItemOption(branchCodes),
          getMenu(branchCodes),
          getOption(branchCodes),
        ]);

        setItemOptions(itemOptionData);
        setMenuData(menus);
        setOptionData(options);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  console.log(menuData);

  const handleUpdate = async () => {
    const updatedOptions = itemOptions.map((item) => {
      const menu = menuData.find((menu) => menu.MenuName === item.MenuName);
      const option = optionData.find(
        (option) => option.OptionName === item.OptionName
      );

      return {
        ...item,
        CategoryId: "", // Default to empty string
        MenuId: menu ? menu.MenuId : "",
        OptionId: option ? option.OptionId : "",
      };
    });

    try {
      await updateItemOptions(updatedOptions);
      alert("Data successfully updated!");
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Failed to update data.");
    }
  };

  const columns = [
    {
      field: "BranchName",
      headerName: "Branch Name",
      flex: 1,
      headerAlign: "left",
    },
    {
      field: "MenuName",
      headerName: "Menu Name",
      flex: 1,
      headerAlign: "left",
    },
    {
      field: "OptionName",
      headerName: "Option Name",
      flex: 1,
      headerAlign: "left",
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="ADD CATEGORYID, MENUID & OPTIONID"
        subtitle="Managing the Option"
      />
      <Button
        variant="contained"
        color="secondary"
        onClick={handleUpdate}
        style={{ marginBottom: "20px" }}
      >
        Update Item Options
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
          rows={itemOptions}
          columns={columns}
          getRowId={(row) => row.ItemOptionId}
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default AddIDdiItemOption;
