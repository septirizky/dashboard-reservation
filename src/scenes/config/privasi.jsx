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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  deleteConfig,
  fetchConfigs,
  toggleConfigShow,
} from "../../data/config";

const ConfigPrivasi = () => {
  const [configs, setConfigs] = useState([]);
  const navigate = useNavigate();

  const getConfigs = async () => {
    try {
      const data = await fetchConfigs();
      const filteredData = data.filter(
        (config) => config.title === "KEBIJAKAN PRIVASI"
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
    try {
      await deleteConfig(configId);
      getConfigs();
    } catch (error) {
      console.error("Error deleting config:", error);
    }
  };

  useEffect(() => {
    getConfigs();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Configurations</h1>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/add-config")}
        style={{ marginBottom: "20px" }}
      >
        Add New Configuration
      </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Show</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {configs.map((config) => (
              <TableRow key={config.configId}>
                <TableCell>{config.title}</TableCell>
                <TableCell>
                  <div
                    style={{
                      maxWidth: "900px",
                      overflowWrap: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {config.content}
                  </div>
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
    </div>
  );
};

export default ConfigPrivasi;
