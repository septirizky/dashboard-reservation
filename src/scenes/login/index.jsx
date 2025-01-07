import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import API from "../../api/Api";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      navigate("/calendar");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${API}/user/login`, { phone });

      if (response.data) {
        const { token, user } = response.data;

        localStorage.setItem("authToken", token);
        localStorage.setItem("userData", JSON.stringify(user));

        navigate("/calendar");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className="login-page"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(https://image-layanan.nos.jkt-1.neo.id/background_1.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{ bgcolor: "white", p: 4, borderRadius: 2, boxShadow: 3 }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          GRO Login
        </Typography>
        <form onSubmit={handleLogin}>
          <Box mb={2}>
            <TextField
              label="Masukan nomor telepon"
              variant="outlined"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              sx={{
                backgroundColor: "#f9f9f9", 
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#888", 
                  },
                  "&:hover fieldset": {
                    borderColor: "#888", 
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#000", 
                  },
                  color: "#000", 
                },
                "& .MuiInputLabel-root": {
                  color: "#000", 
                },
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          {message && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            startIcon={
              loading && <CircularProgress size={20} color="inherit" />
            }
          >
            {loading ? "Sending OTP..." : "Login"}
          </Button>
        </form>
      </Container>
    </Box>
  );
};

export default Login;
