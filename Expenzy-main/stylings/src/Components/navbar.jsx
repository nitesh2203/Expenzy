import React, { useState, useEffect } from "react";
import {
  AppBar, Box, Toolbar, Typography, Avatar, Button, IconButton,
  Menu, MenuItem, Drawer, List, ListItem, ListItemButton, ListItemText,
  Container, Switch, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, Snackbar
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import moneyFlow from "../assets/flow.png";

// Define available pages
const pages = ["Home", "Transactions", "Budgets", "Reports", "Jobs"];

// Custom Dark Mode Switch
const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62, height: 34, padding: 7,
  "& .MuiSwitch-switchBase": {
    padding: 6,
    "&.Mui-checked": {
      transform: "translateX(28px)", color: "#fff",
      "& + .MuiSwitch-track": { backgroundColor: "#ff9800", opacity: 1 },
    },
  },
  "& .MuiSwitch-thumb": { width: 22, height: 22, backgroundColor: theme.palette.mode === "dark" ? "#f5a623" : "#001e3c" },
  "& .MuiSwitch-track": { borderRadius: 20, backgroundColor: theme.palette.mode === "dark" ? "#37474F" : "#90CAF9", opacity: 1 },
})); 

export default function Navbar({ darkMode, setDarkMode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  // Check localStorage for user email
  useEffect(() => {
    const checkLoginStatus = () => {
      const userEmail = localStorage.getItem("email");
      setIsLoggedIn(!!userEmail); // Convert to boolean (true if email exists)
    };

    checkLoginStatus(); // Run on mount

    // Listen for localStorage changes
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  // Logout function
  const logout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token"); // Remove token too
    setIsLoggedIn(false); // Update state
    setLogoutDialogOpen(false);
    setSnackbarOpen(true);
    navigate("/login");
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "var(--color-base-200)", color: "var(--color-base-content)" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo & Name */}
            <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
              <Avatar alt="Expenzy" src={logo} sx={{ width: 40, height: 40, mr: 1 }} />
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{ fontFamily: "monospace", fontWeight: 700, letterSpacing: ".3rem", color: "var(--color-base-content)", textDecoration: "none" }}
              >
                Expenzy
              </Typography>
              {/* Money Flow Animation Next to Logo */}
              <img
                src={moneyFlow}
                alt="Money Flow Animation"
                style={{ marginLeft: "10px", width: "50px", animation: "moneyFlow 3s infinite ease-in-out" }}
              />
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, justifyContent: "center" }}>
              {pages.map((page) => (
                <Button key={page} sx={{ my: 2, color: "var(--color-base-content)" }} component={Link} to={`/${page.toLowerCase()}`}>
                  {page}
                </Button>
              ))}
            </Box>

            {/* Theme Toggle */}
            <MaterialUISwitch checked={darkMode} onChange={() => setDarkMode(!darkMode)} sx={{ mx: 2 }} />

            {/* Authentication Buttons */}
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              {isLoggedIn ? (
                <Button variant="contained" color="secondary" onClick={() => setLogoutDialogOpen(true)}>Logout</Button>
              ) : (
                <Button variant="contained" color="secondary" component={Link} to="/login">Login</Button>
              )}
            </Box>

            {/* Mobile Drawer */}
            <IconButton edge="end" color="inherit" sx={{ display: { xs: "block", md: "none" } }} onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>

            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              <List sx={{ width: 250 }}>
                {pages.map((page) => (
                  <ListItem key={page} disablePadding>
                    <ListItemButton component={Link} to={`/${page.toLowerCase()}`} onClick={() => setDrawerOpen(false)}>
                      <ListItemText primary={page} />
                    </ListItemButton>
                  </ListItem>
                ))}
                <ListItem disablePadding>
                  {isLoggedIn ? (
                    <ListItemButton onClick={() => setLogoutDialogOpen(true)}>
                      <ListItemText primary="Logout" />
                    </ListItemButton>
                  ) : (
                    <ListItemButton component={Link} to="/login" onClick={() => setDrawerOpen(false)}>
                      <ListItemText primary="Login" />
                    </ListItemButton>
                  )}
                </ListItem>
              </List>
            </Drawer>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to log out?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)} color="primary">Cancel</Button>
          <Button onClick={logout} color="secondary">Logout</Button>
        </DialogActions>
      </Dialog>

      {/* Logout Snackbar Notification */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} message="Logged out successfully" />
    </>
  );
}
