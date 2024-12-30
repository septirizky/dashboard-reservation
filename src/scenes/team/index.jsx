import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Button,
  Modal,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { fetchTeams, updateUser, updateUserStatus } from "../../data/teamData";
import { toast, ToastContainer } from "react-toastify";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [teams, setTeams] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const getTeams = async () => {
    try {
      const data = await fetchTeams();
      const activeTeams = data.filter((team) => team.status === "ACTIVE");
      setTeams(activeTeams);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  useEffect(() => {
    getTeams();
  }, []);

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setCurrentUser(null);
  };

  const handleSave = async () => {
    try {
      await updateUser(currentUser.userId, currentUser);
      setOpenModal(false);
      const updatedTeams = await fetchTeams();
      setTeams(updatedTeams);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const updatedBranchCodes = currentUser.branchCode.includes(value)
        ? currentUser.branchCode.filter((code) => code !== value)
        : [...currentUser.branchCode, value];
      setCurrentUser((prev) => ({ ...prev, branchCode: updatedBranchCodes }));
    } else {
      setCurrentUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDelete = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmed) return;

    try {
      await updateUserStatus(userId, "DELETE");
      const updatedTeams = await fetchTeams();
      const activeTeams = updatedTeams.filter(
        (team) => team.status === "ACTIVE"
      );
      setTeams(activeTeams);
      toast.success("User status updated to DELETE.");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to update user status.");
    }
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1, headerAlign: "center" },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "branchCode",
      headerName: "Branch Code",
      flex: 1,
      headerAlign: "center",
    },
    { field: "role", headerName: "Role", flex: 1, headerAlign: "center" },
    {
      field: "lastLogin",
      headerName: "Last Login",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => new Date(params.value).toLocaleString("en-US"),
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
            onClick={() => handleDelete(params.row.userId)}
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
      <Header title="TEAMS" subtitle="Managing the Teams" />
      <Box display="flex" justifyContent="flex-start" mb={2}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => (window.location.href = "/add-user")}
        >
          CREATE NEW USER
        </Button>
      </Box>
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
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            fontSize: "0.9rem",
            fontWeight: "bold",
          },
        }}
      >
        <DataGrid
          rows={teams}
          columns={columns}
          getRowId={(row) => row.userId}
        />
      </Box>
      <Modal open={openModal} onClose={handleModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 1,
          }}
        >
          <h2>Edit User</h2>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            name="name"
            value={currentUser?.name || ""}
            onChange={handleChange}
          />
          <TextField
            label="Phone"
            fullWidth
            margin="normal"
            name="phone"
            value={currentUser?.phone || ""}
            onChange={handleChange}
          />
          <Select
            name="role"
            fullWidth
            value={currentUser?.role || ""}
            onChange={handleChange}
          >
            {[
              "IT",
              "Business Development",
              "Manager Accounting",
              "Assistant Manager Accounting",
              "Head Accounting",
              "Accounting",
              "GRO",
            ].map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
          <Box>
            {["AN", "AS", "BK", "BTR", "CR", "PIK", "PS"].map((branch) => (
              <FormControlLabel
                key={branch}
                control={
                  <Checkbox
                    checked={currentUser?.branchCode.includes(branch)}
                    value={branch}
                    onChange={handleChange}
                    sx={{
                      color: "#4CAF50",
                      "&.Mui-checked": {
                        color: "#4CAF50",
                      },
                    }}
                  />
                }
                label={branch}
              />
            ))}
          </Box>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              onClick={handleSave}
              variant="contained"
              sx={{
                backgroundColor: "#4CAF50",
                "&:hover": {
                  backgroundColor: "#388E3C",
                },
                color: "#fff",
              }}
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

export default Team;
