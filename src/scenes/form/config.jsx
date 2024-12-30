import React, { useState } from "react";
import { Box, TextField, Switch, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Untuk navigasi
import { addConfig } from "../../data/config";
import { toast, ToastContainer } from "react-toastify"; // Toast
import "react-toastify/dist/ReactToastify.css"; // Gaya Toastify

const AddConfigPage = ({ onConfigAdded }) => {
  const [newConfig, setNewConfig] = useState({
    title: "",
    content: "",
    show: true,
  });

  const navigate = useNavigate(); // Untuk navigasi

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewConfig((prevState) => ({
      ...prevState,
      [name]: name === "show" ? e.target.checked : value,
    }));
  };

  // Handle add configuration
  const handleAddConfig = async () => {
    try {
      await addConfig(newConfig);
      setNewConfig({ title: "", content: "", show: true }); // Reset form

      toast.success("Configuration added successfully!", {
        position: "top-right",
        autoClose: 2000, // Durasi 2 detik
      });

      // Navigasi ke halaman Configuration setelah 2 detik
      setTimeout(() => {
        navigate("/config_menu");
      }, 2000);

      if (onConfigAdded) {
        onConfigAdded(); // Callback untuk menyegarkan data
      }
    } catch (error) {
      console.error("Error adding config:", error);
      toast.error("Failed to add configuration!", {
        position: "top-right",
        autoClose: 2000, // Durasi 2 detik
      });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Add New Configuration</h1>
      <Box
        component="form"
        display="flex"
        flexDirection="column"
        gap={2}
        maxWidth="1200px"
      >
        <TextField
          label="Title"
          name="title"
          value={newConfig.title}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Content"
          name="content"
          value={newConfig.content}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={26}
        />
        <Box display="flex" alignItems="center" gap={2}>
          <Switch
            checked={newConfig.show}
            name="show"
            color="secondary"
            onChange={handleInputChange}
          />
          <span>Show</span>
        </Box>
        <Button variant="contained" color="secondary" onClick={handleAddConfig}>
          Add Config
        </Button>
      </Box>

      <ToastContainer />
    </div>
  );
};

export default AddConfigPage;
