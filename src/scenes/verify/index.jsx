import { useState } from "react";
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

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${API}/user/verify-otp`, {
        phone: localStorage.getItem("phone"),
        otp,
      });

      // Cek apakah respons memiliki token
      if (response.data.token) {
        const { token, user } = response.data;

        localStorage.setItem("authToken", token);
        localStorage.setItem("userData", JSON.stringify(user));

        navigate("/calendar");
      } else {
        setMessage("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className="verify-otp-page"
      sx={{
        width: "100vw", // Full width
        height: "100vh", // Full height
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
          Verify OTP
        </Typography>
        <form onSubmit={handleVerify}>
          <Box mb={2}>
            <TextField
              label="Enter OTP"
              variant="outlined"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
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
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
      </Container>
    </Box>
  );
};

export default VerifyOTP;
