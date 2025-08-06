import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, Close, Google as GoogleIcon, Facebook as FacebookIcon } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = ({ darkMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" });
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log("Full API Response:", data); // Log entire response
  
      if (response.ok && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        
        console.log("User Details Stored in Local Storage:");
        console.table(data.user); // Log user details in a table format
      } else {
        console.error("Login failed or user data missing");
      }
      
      return data;
    } catch (error) {
      console.error("Login Error:", error);
      return { message: "Login Failed" };
    }
  };
  

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = await login(email, password);

    if (data.user) {
      setSnackbar({ open: true, message: "Login Successful!", severity: "success" });
      setTimeout(() => navigate("/home"), 1500);
    } else {
      setSnackbar({ open: true, message: data.message || "Login Failed", severity: "error" });
    }
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    setDialogMessage("Google login is under maintenance. Please try again later.");
    setOpenDialog(true);
  };

  const handleFacebookLogin = () => {
    setDialogMessage("Facebook login is under maintenance. Please try again later.");
    setOpenDialog(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: darkMode ? "#1c1c1c" : "#f4f4f4",
      }}
    >
      <Container maxWidth="xs">
        <Card
          sx={{
            p: 3,
            borderRadius: 3,
            textAlign: "center",
            backgroundColor: darkMode ? "#2d2d2d" : "#ffffff",
            color: darkMode ? "#ffffff" : "#222245",
            boxShadow: darkMode ? "0px 0px 20px rgba(255,255,255,0.1)" : "0px 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <CardHeader title="Welcome Back! Login to Continue" sx={{ color: darkMode ? "#8A2BE2" : "#4B0082" }} />
          <CardContent>
            <form onSubmit={handleEmailLogin}>
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={inputStyle(darkMode)}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={inputStyle(darkMode)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                fullWidth
                type="Submit"
                variant="contained"
                sx={buttonStyle(darkMode)}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Login"}
              </Button>
            </form>

            <Typography variant="body2" sx={{ my: 3, fontWeight: "bold", color: darkMode ? "#bbbbbb" : "#666666" }}>
              OR
            </Typography>

            <Button fullWidth variant="outlined" onClick={handleGoogleLogin} sx={buttonStyle(darkMode)}>
              <GoogleIcon />
              Login with Google
            </Button>

            <Button fullWidth variant="outlined" onClick={handleFacebookLogin} sx={buttonStyle(darkMode)}>
              <FacebookIcon />
              Login with Facebook
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 3, color: darkMode ? "#bbb" : "#555" }}>
              Don't have an account?{" "}
              <Link to="/signup" style={{ textDecoration: "none", color: darkMode ? "#8A2BE2" : "#1976d2", fontWeight: "bold" }}>
                Sign Up
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        action={<IconButton size="small" onClick={() => setSnackbar({ ...snackbar, open: false })}><Close /></IconButton>}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Feature Under Maintenance</DialogTitle>
        <DialogContent><Typography>{dialogMessage}</Typography></DialogContent>
        <DialogActions><Button onClick={() => setOpenDialog(false)}>OK</Button></DialogActions>
      </Dialog>
    </Box>
  );
};

// Styles
const buttonStyle = (darkMode) => ({
  color: darkMode ? "#ffffff" : "#222245",
  borderColor: darkMode ? "#ffffff" : "#222245",
  display: "flex",
  alignItems: "center",
  gap: 1,
  borderRadius: 2,
  py: 1,
  mt: 1,
  "&:hover": { backgroundColor: darkMode ? "#444" : "#ddd" },
});

const inputStyle = (darkMode) => ({
  backgroundColor: darkMode ? "#3b3b3b" : "#f9f9f9",
  borderRadius: 1,
  input: { color: darkMode ? "#ffffff" : "#000000" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: darkMode ? "#ffffff" : "#222245" },
    "&:hover fieldset": { borderColor: darkMode ? "#8A2BE2" : "#1976d2" },
    "&.Mui-focused fieldset": { borderColor: darkMode ? "#8A2BE2" : "#1976d2" },
  },
});

export default LoginPage;
