import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Switch,
  Button,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import {
  getBranch,
  updateBranchData,
  updateBranchShow,
} from "../../data/branch";

const Branch = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [branches, setBranches] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(number)
      .replace("Rp", "Rp ");
  };

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const branchData = await getBranch();
        const transformedData = branchData.map((branch) => ({
          ...branch,
          branchMinimumPurchaseFormmated: formatRupiah(
            branch.branchMinimumPurchase || 0
          ),
        }));
        setBranches(transformedData);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, []);

  const handleOpenModal = (branch) => {
    setSelectedBranch(branch);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedBranch(null);
    setOpenModal(false);
  };

  const handleToggleChange = async (branchId, currentValue) => {
    try {
      setBranches((prevBranches) =>
        prevBranches.map((branch) =>
          branch.branchId === branchId
            ? { ...branch, branchShow: !currentValue }
            : branch
        )
      );
      await updateBranchShow(branchId, !currentValue);
    } catch (error) {
      console.error("Error updating branchShow:", error);
      setBranches((prevBranches) =>
        prevBranches.map((branch) =>
          branch.branchId === branchId
            ? { ...branch, branchShow: currentValue }
            : branch
        )
      );
    }
  };

  const columns = [
    {
      field: "branchName",
      headerName: "Branch Name",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "branchCode",
      headerName: "Branch Code",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "branchAddress",
      headerName: "Address",
      flex: 3,
      headerAlign: "center",
    },
    {
      field: "branchPhone",
      headerName: "Phone",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "branchMinimumPurchaseFormmated",
      headerName: "Minimum Purchase",
      flex: 0.6,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "branchShow",
      headerName: "Show",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => (
        <Switch
          checked={params.row.branchShow}
          onChange={() =>
            handleToggleChange(params.row.branchId, params.row.branchShow)
          }
          color="secondary"
        />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleOpenModal(params.row)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="BRANCH" subtitle="Managing the Branch" />
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
          "& .name-column--cell": {
            color: colors.greenAccent[300],
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
          rows={branches}
          columns={columns}
          getRowId={(row) => row.branchId}
          disableSelectionOnClick
        />
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: "8px",
            }}
          >
            <Typography variant="h6" mb={2}>
              Edit Branch
            </Typography>
            {selectedBranch && (
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Branch Name"
                  value={selectedBranch.branchName}
                  onChange={(e) =>
                    setSelectedBranch({
                      ...selectedBranch,
                      branchName: e.target.value,
                    })
                  }
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Branch Code"
                  value={selectedBranch.branchCode}
                  onChange={(e) =>
                    setSelectedBranch({
                      ...selectedBranch,
                      branchCode: e.target.value,
                    })
                  }
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Address"
                  value={selectedBranch.branchAddress}
                  onChange={(e) =>
                    setSelectedBranch({
                      ...selectedBranch,
                      branchAddress: e.target.value,
                    })
                  }
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Phone"
                  value={selectedBranch.branchPhone}
                  onChange={(e) =>
                    setSelectedBranch({
                      ...selectedBranch,
                      branchPhone: e.target.value,
                    })
                  }
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Minimum Purchase"
                  value={selectedBranch.branchMinimumPurchase}
                  onChange={(e) =>
                    setSelectedBranch({
                      ...selectedBranch,
                      branchMinimumPurchase: e.target.value,
                    })
                  }
                />
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleCloseModal}
                    sx={{ mr: 2 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={async () => {
                      try {
                        await updateBranchData(
                          selectedBranch.branchId,
                          selectedBranch
                        );
                        setBranches((prev) =>
                          prev.map((branch) =>
                            branch.branchId === selectedBranch.branchId
                              ? selectedBranch
                              : branch
                          )
                        );
                        handleCloseModal();
                      } catch (error) {
                        console.error("Error updating branch:", error);
                      }
                    }}
                  >
                    Save
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default Branch;
