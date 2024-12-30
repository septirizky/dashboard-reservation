import React, { useState, useEffect } from "react";
import { Box, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import {
  getOptionPackage,
  postAllOptionPackage,
} from "../../data/optionPackageData";

const OptionPackageData = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [optionPackages, setOptionPackages] = useState([]);

  useEffect(() => {
    const branchCodes =
      JSON.parse(localStorage.getItem("userData")).branchCode || [];

    const fetchOption = async () => {
      try {
        const optionPackageData = await getOptionPackage(branchCodes);
        setOptionPackages(optionPackageData);
      } catch (error) {
        console.error("Error fetching option:", error);
      }
    };

    fetchOption();
  }, []);

  const handlePostAll = async () => {
    if (!optionPackages || optionPackages.length === 0) {
      alert("No option to post.");
      return;
    }

    try {
      const response = await postAllOptionPackage(optionPackages);
      console.log("Data successfully posted:", response);
      alert("Data successfully posted to backend!");
    } catch (error) {
      console.error("Error posting data:", error);
      alert("Failed to post data to backend.");
    }
  };

  const columns = [
    {
      field: "OptionPackageID",
      headerName: "Option ID",
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
      field: "OptionPackagesCategoryText",
      headerName: "Category Text",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "OptionPackagesCode",
      headerName: "Option Code",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "OptionPackagesName",
      headerName: "Option Name",
      flex: 1,
      headerAlign: "center",
    },
  ];

  return (
    <Box m="20px">
      <Header title="OPTION" subtitle="Managing the Option" />
      <Button
        variant="contained"
        color="secondary"
        onClick={handlePostAll}
        style={{ marginBottom: "20px" }}
      >
        Post All option package to Backend
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
          rows={optionPackages}
          columns={columns}
          getRowId={(row) => row.OptionPackageID}
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default OptionPackageData;
