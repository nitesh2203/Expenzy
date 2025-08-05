import React from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";

// Temporary GIF URL (Replace with local file if needed)
const heroGif =
  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcW84dGt3dmFnbzBkOHY2cTZ2NXNybGFvNDY3amF6enU4M2l4Y2oyeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/aBB2j4G6srsaij0V5T/giphy.gif";

// Light & Dark Theme Configuration
const HeroTheme = (darkMode) =>
  createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      background: {
        default: darkMode ? "#181818" : "#fcfcfe",
        paper: darkMode ? "#232323" : "#ffffff",
      },
      text: {
        primary: darkMode ? "#ffffff" : "#222245",
        secondary: darkMode ? "#d1d1d1" : "#555",
      },
    },
    typography: {
      fontFamily: "Arial, sans-serif",
    },
  });

const HeroPage = ({ darkMode }) => {
  const theme = HeroTheme(darkMode);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: darkMode
            ? "linear-gradient(135deg, #1e1e1e, #232323)"
            : "linear-gradient(135deg, #f4f4fc, #fcfcfe)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 0",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            {/* Left Side - Animated GIF */}
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={heroGif}
                alt="Hero Animation"
                sx={{
                  width: "100%",
                  maxHeight: 400,
                  borderRadius: 3,
                }}
              />
            </Grid>

            {/* Right Side - Title, Features & Buttons */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  color: theme.palette.text.primary,
                }}
              >
                Manage Your Expenses Smarter with Expenzy!
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: theme.palette.text.secondary, mb: 3 }}
              >
                Track, analyze, and optimize your spending effortlessly.
              </Typography>

              {/* Feature Accordion */}
              {[
                {
                  title: "Core Expense Features",
                  description:
                    "Provides a dashboard with summaries, detailed transaction tracking, categorized expenses, budget management, and insightful reports with analytics.",
                },
                {
                  title: "Advanced Features",
                  description:
                    "Includes goal-based savings tracking, recurring expense management, AI-driven spending insights, bill reminders, and multi-user collaboration.",
                },
                {
                  title: "Sync & Security",
                  description:
                    "Offers a dark mode toggle, seamless bank synchronization, export options for CSV/PDF, and personalized settings for profile and security management.",
                },
                {
                  title: "Innovative Add-ons",
                  description:
                    "Features voice-based expense input, bill scanning for automatic entry, investment tracking, gamification rewards, shared expense management, and expense forecasting.",
                },
              ].map((feature, index) => (
                <Accordion
                  key={index}
                  sx={{
                    mb: 2,
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon
                        sx={{ color: theme.palette.text.primary }}
                      />
                    }
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        color: theme.palette.text.primary,
                      }}
                    >
                      {feature.title}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                      {feature.description}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}

              {/* Action Buttons */}
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{
                    mr: 2,
                    fontWeight: "bold",
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                  }}
                  component={Link}
                  to="/login"
                >
                  Log In
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{
                    fontWeight: "bold",
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    borderWidth: 2,
                  }}
                  component={Link}
                  to="/signup"
                >
                  Sign Up
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default HeroPage;
