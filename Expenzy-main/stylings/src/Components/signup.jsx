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
  Snackbar,
  IconButton,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Visibility, VisibilityOff, Close, Google as GoogleIcon, Facebook as FacebookIcon } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const signup = async (email, password, income) => {
  try {
    const response = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, income }),
    });

    const data = await response.json();

    console.log("Server Response:", data); // Debugging

    if (!data.msg) { // Check if the message exists in the response
      throw new Error(data.message || "Signup failed");
    }
    

    return data;
  } catch (error) {
    console.error("Signup Error:", error.message);
    return { success: false, message: error.message };
  }
};



const SignupPage = ({ darkMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [income, setIncome] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" });
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await signup(email, password, income);

    if (response?.success) {
      setSnackbar({ open: true, message: "Signup Successful! Redirecting...", severity: "success" });
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setSnackbar({ open: true, message: response?.message || "Signup Failed", severity: "error" });
    }
    setLoading(false);
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
          }}
        >
          <CardHeader title="Create an Account" sx={{ color: darkMode ? "#8A2BE2" : "#4B0082" }} />
          <CardContent>
            <form onSubmit={handleSignup}>
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ backgroundColor: darkMode ? "#3b3b3b" : "#f9f9f9", borderRadius: 1 }}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ backgroundColor: darkMode ? "#3b3b3b" : "#f9f9f9", borderRadius: 1 }}
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
              <TextField
                fullWidth
                label="Income"
                variant="outlined"
                margin="normal"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                sx={{ backgroundColor: darkMode ? "#3b3b3b" : "#f9f9f9", borderRadius: 1 }}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 2, fontWeight: "bold", borderRadius: 2, py: 1 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Sign Up"}
              </Button>
            </form>

            <Typography variant="body2" sx={{ my: 3, fontWeight: "bold", color: darkMode ? "#bbbbbb" : "#666666" }}>
              OR
            </Typography>

            <Button fullWidth variant="outlined" onClick={() => setOpenDialog(true)} sx={{ mb: 2 }}>
              <GoogleIcon sx={{ mr: 1 }} />
              Sign Up with Google
            </Button>

            <Button fullWidth variant="outlined" onClick={() => setOpenDialog(true)}>
              <FacebookIcon sx={{ mr: 1 }} />
              Sign Up with Facebook
            </Button>

            <Typography variant="body2" sx={{ mt: 3 }}>
              Already have an account?{" "}
              <Link to="/login" style={{ textDecoration: "none", fontWeight: "bold" }}>
                Login
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>

      {/* Snackbar for Messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        action={
          <IconButton size="small" onClick={() => setSnackbar({ ...snackbar, open: false })}>
            <Close />
          </IconButton>
        }
      />

      {/* Dialog for "Under Maintenance" */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Feature Under Maintenance</DialogTitle>
        <DialogContent>
          <Typography>Google and Facebook signup are under maintenance.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SignupPage;
