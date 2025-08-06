import React, { useEffect, useState, useMemo } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  CircularProgress,
} from "@mui/material";

// Theme function
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

const Transactions = ({ darkMode, email }) => {  
  const [dailyLog, setDailyLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  useEffect(() => {
    fetchDailyLog();
  }, []);

  const fetchDailyLog = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/expenses/daily?email=${email}`);
      const data = await response.json();
      if (response.ok) {
        setDailyLog(data.dailyLog);
      } else {
        setError(data.message || "Failed to fetch data");
      }
    } catch (error) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  // Group transactions by date and category
  const groupedTransactions = useMemo(() => {
    const result = {};
    dailyLog.forEach(({ date, category, amount }) => {
      const key = `${date}-${category}`;
      if (!result[key]) {
        result[key] = { date, category, totalAmount: 0 };
      }
      result[key].totalAmount += amount;
    });
    return Object.values(result);
  }, [dailyLog]);

  return (
    <ThemeProvider theme={HeroTheme(darkMode)}>
      <CssBaseline />
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: 2,
        }}
      >
        <Typography variant="h5" sx={{ textAlign: "center", mb: 1 }}>
          Daily Transactions
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Paper sx={{ width: "100%", p: 2, overflowX: "auto" }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Total Amount ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedTransactions
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell align="right">{row.totalAmount}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={groupedTransactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPageOptions={[]}
            />
          </Paper>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Transactions;
