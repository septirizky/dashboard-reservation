import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  deleteConfig,
  fetchConfigs,
  toggleConfigShow,
  updateConfig,
} from "../../data/config";

const Configuration = () => {
  const [configs, setConfigs] = useState([]);
  const [editConfig, setEditConfig] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const navigate = useNavigate();

  const getConfigs = async () => {
    try {
      const data = await fetchConfigs();
      const filteredData = data.filter(
        (config) =>
          config.title !== "DISAJIKAN" && config.title !== "KEBIJAKAN PRIVASI"
      );
      setConfigs(filteredData);
    } catch (error) {
      console.error("Error fetching configs:", error);
    }
  };

  const handleToggle = async (configId, currentShow) => {
    try {
      await toggleConfigShow(configId, !currentShow);
      getConfigs();
    } catch (error) {
      console.error("Error updating show status:", error);
    }
  };

  const handleDeleteConfig = async (configId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this configuration?"
    );
    if (!confirmed) return;

    try {
      await deleteConfig(configId);
      getConfigs();
    } catch (error) {
      console.error("Error deleting config:", error);
    }
  };

  const handleEditClick = (config) => {
    setEditConfig(config);
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    try {
      if (editConfig) {
        await updateConfig(editConfig.configId, {
          title: editConfig.title,
          content: editConfig.content,
          show: editConfig.show,
        });
        setEditDialogOpen(false);
        setEditConfig(null);
        getConfigs();
      }
    } catch (error) {
      console.error("Error updating config:", error);
    }
  };

  useEffect(() => {
    getConfigs();
  }, []);

  return (
    <Box padding="20px">
      <h1>Configurations</h1>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/add-config")}
        sx={{ marginBottom: "20px" }}
      >
        Add New Configuration
      </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell style={{ width: "50%" }}>Content</TableCell>
              <TableCell>Show</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {configs.map((config) => (
              <TableRow key={config.configId}>
                <TableCell>{config.title}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      maxWidth: "100%",
                      overflowWrap: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {config.content}
                  </Box>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={config.show}
                    color="secondary"
                    onChange={() => handleToggle(config.configId, config.show)}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    color="green"
                    onClick={() => handleEditClick(config)}
                    sx={{ marginRight: "10px" }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteConfig(config.configId)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Edit */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Configuration</DialogTitle>
        <DialogContent>
          {editConfig && (
            <Box>
              <TextField
                label="Title"
                value={editConfig.title}
                onChange={(e) =>
                  setEditConfig((prev) => ({ ...prev, title: e.target.value }))
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Content"
                value={editConfig.content}
                onChange={(e) =>
                  setEditConfig((prev) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                fullWidth
                multiline
                rows={4}
                margin="normal"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditDialogOpen(false)}
            variant="contained"
            color="error"
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditSave}
            variant="contained"
            color="secondary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Configuration;
