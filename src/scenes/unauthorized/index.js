import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/login"); // Arahkan ke halaman login
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Typography variant="h4" color="error">
        Unauthorized Access
      </Typography>
      <Typography variant="subtitle1">
        You do not have permission to view this page.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleBack}
        sx={{ mt: 2 }}
      >
        Go to Login
      </Button>
    </Box>
  );
};

export default Unauthorized;
