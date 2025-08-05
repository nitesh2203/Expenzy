import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Fab, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  useTheme,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Avatar,
  Divider
} from '@mui/material';
import { 
  Add as AddIcon, 
  Fastfood as FoodIcon,  
  FlightTakeoff as TravelIcon,
  Receipt as BillsIcon,
  ShoppingBag as ShoppingIcon,
  Theaters as EntertainmentIcon,
  AttachMoney as IncomeIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import nlp from 'compromise';

// Custom colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Mock categories with icons
const categories = [
  { name: 'Food', icon: <FoodIcon />, keywords: ['food', 'swiggy', 'zomato', 'lunch', 'dinner', 'breakfast', 'burger', 'pizza', 'restaurant', 'cafe', 'grocery', 'groceries'] },
  { name: 'Travel', icon: <TravelIcon />, keywords: ['travel', 'uber', 'ola', 'taxi', 'flight', 'train', 'bus', 'metro', 'fuel', 'gas', 'petrol'] },
  { name: 'Bills', icon: <BillsIcon />, keywords: ['bill', 'electricity', 'water', 'rent', 'recharge', 'wifi', 'internet', 'mobile', 'phone', 'subscription', 'airtel'] },
  { name: 'Shopping', icon: <ShoppingIcon />, keywords: ['shopping', 'amazon', 'flipkart', 'myntra', 'clothes', 'shoes', 'electronics', 'gadgets'] },
  { name: 'Entertainment', icon: <EntertainmentIcon />, keywords: ['entertainment', 'netflix', 'amazon prime', 'hotstar', 'movie', 'concert', 'spotify', 'music'] },
  { name: 'Income', icon: <IncomeIcon />, keywords: ['income', 'salary', 'bonus', 'refund', 'investment', 'dividend', 'interest'] }
];

// Mock initial data
const initialTransactions = [
  { id: 1, amount: 2500, category: 'Income', description: 'Freelance project', date: new Date(2025, 3, 1), isIncome: true },
  { id: 2, amount: 699, category: 'Food', description: 'Dinner at Italian restaurant', date: new Date(2025, 3, 10), isIncome: false },
  { id: 3, amount: 399, category: 'Bills', description: 'Electricity bill', date: new Date(2025, 3, 12), isIncome: false },
  { id: 4, amount: 5000, category: 'Income', description: 'Side hustle payment', date: new Date(2025, 3, 15), isIncome: true },
  { id: 5, amount: 1200, category: 'Shopping', description: 'New headphones', date: new Date(2025, 3, 16), isIncome: false },
  { id: 6, amount: 850, category: 'Travel', description: 'Uber rides this week', date: new Date(2025, 3, 17), isIncome: false },
  { id: 7, amount: 199, category: 'Entertainment', description: 'Netflix subscription', date: new Date(2025, 3, 18), isIncome: false },
];

// Monthly data for chart
const monthlyData = [
  { name: 'Jan', income: 15000, expenses: 12000 },
  { name: 'Feb', income: 18000, expenses: 14000 },
  { name: 'Mar', income: 16000, expenses: 13500 },
  { name: 'Apr', income: 17500, expenses: 13000 }
];

export default function Dashboard() {
  const theme = useTheme();
  const [transactions, setTransactions] = useState(initialTransactions);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: 'Food',
    description: '',
    date: new Date(),
    isIncome: false
  });
  const [quickAddText, setQuickAddText] = useState('');

  // Calculate summary data
  const totalIncome = transactions
    .filter(t => t.isIncome)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => !t.isIncome)
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Prepare data for pie chart
  const pieChartData = categories
    .filter(cat => cat.name !== 'Income')
    .map(category => {
      const amount = transactions
        .filter(t => !t.isIncome && t.category === category.name)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return { name: category.name, value: amount };
    })
    .filter(item => item.value > 0);

  // Handle dialog open/close
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({ ...prev, [name]: value }));
  };

  // Handle category change with isIncome toggle
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setNewExpense(prev => ({ 
      ...prev,
      category,
      isIncome: category === 'Income'
    }));
  };

  // Handle date change
  const handleDateChange = (newDate) => {
    setNewExpense(prev => ({ ...prev, date: newDate }));
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!newExpense.amount || !newExpense.description) {
      setSnackbar({
        open: true,
        message: 'Please fill all required fields',
        severity: 'error'
      });
      return;
    }

    const amount = parseFloat(newExpense.amount);
    if (isNaN(amount) || amount <= 0) {
      setSnackbar({
        open: true,
        message: 'Please enter a valid amount',
        severity: 'error'
      });
      return;
    }

    const newTransaction = {
      ...newExpense,
      id: transactions.length + 1,
      amount: parseFloat(newExpense.amount)
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setSnackbar({
      open: true,
      message: `${newExpense.isIncome ? 'Income' : 'Expense'} added successfully!`,
      severity: 'success'
    });
    
    // Reset form and close dialog
    setNewExpense({
      amount: '',
      category: 'Food',
      description: '',
      date: new Date(),
      isIncome: false
    });
    handleCloseDialog();
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Parse NLP input and extract expense details
  const parseNaturalLanguage = (text) => {
    if (!text.trim()) return null;

    const doc = nlp(text);
    
    // Find amounts with currency symbols or numbers followed by currency words
    let amount = null;
    const moneyPattern = /(\₹|\$|\€|\£)?(\d+(\.\d+)?)/g;
    const matches = text.match(moneyPattern);
    
    if (matches && matches.length > 0) {
      // Extract the first matched amount
      amount = parseFloat(matches[0].replace(/[\₹\$\€\£]/g, ''));
    } else {
      // Try to find numbers in the text
      const numbers = doc.numbers().out('array');
      if (numbers.length > 0) {
        // Convert text numbers to actual numbers
        amount = parseFloat(numbers[0]);
      }
    }

    // Return null if no amount found
    if (!amount || isNaN(amount)) return null;

    // Determine if this is income
    const isIncome = text.toLowerCase().includes('income') || 
                    text.toLowerCase().includes('salary') || 
                    text.toLowerCase().includes('received') ||
                    text.toLowerCase().includes('earned');
    
    // Find category based on keywords
    let category = isIncome ? 'Income' : 'Food'; // Default to Food for expenses
    
    if (!isIncome) {
      const textLower = text.toLowerCase();
      for (const cat of categories) {
        for (const keyword of cat.keywords) {
          if (textLower.includes(keyword.toLowerCase())) {
            category = cat.name;
            break;
          }
        }
      }
    }

    return {
      amount,
      category,
      description: text,
      date: new Date(),
      isIncome
    };
  };

  // Handle quick add form submission
  const handleQuickAdd = (e) => {
    e.preventDefault();
    
    const parsedExpense = parseNaturalLanguage(quickAddText);
    
    if (!parsedExpense) {
      setSnackbar({
        open: true,
        message: 'Could not parse amount from text. Please try again.',
        severity: 'error'
      });
      return;
    }
    
    const newTransaction = {
      ...parsedExpense,
      id: transactions.length + 1
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    setSnackbar({
      open: true,
      message: `${parsedExpense.isIncome ? 'Income' : 'Expense'} added: ₹${parsedExpense.amount} under ${parsedExpense.category}`,
      severity: 'success'
    });
    
    // Reset quick add text
    setQuickAddText('');
  };

  // Delete transaction
  const handleDeleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    setSnackbar({
      open: true,
      message: 'Transaction deleted successfully!',
      severity: 'info'
    });
  };

  // Get icon for category
  const getCategoryIcon = (categoryName) => {
    const category = categories.find(c => c.name === categoryName);
    return category ? category.icon : <ShoppingIcon />;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              borderLeft: '5px solid green',
              height: 140
            }}
          >
            <Typography component="h2" variant="subtitle1" color="text.secondary">
              Total Income
            </Typography>
            <Typography component="p" variant="h4" sx={{ mt: 1 }}>
              ₹{totalIncome.toLocaleString()}
            </Typography>
            <Typography component="p" variant="body2" sx={{ mt: 2 }}>
              as of {new Date().toLocaleDateString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              borderLeft: '5px solid red',
              height: 140
            }}
          >
            <Typography component="h2" variant="subtitle1" color="text.secondary">
              Total Expenses
            </Typography>
            <Typography component="p" variant="h4" sx={{ mt: 1 }}>
              ₹{totalExpenses.toLocaleString()}
            </Typography>
            <Typography component="p" variant="body2" sx={{ mt: 2 }}>
              as of {new Date().toLocaleDateString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              borderLeft: `5px solid ${balance >= 0 ? 'blue' : 'orange'}`,
              height: 140
            }}
          >
            <Typography component="h2" variant="subtitle1" color="text.secondary">
              Monthly Balance
            </Typography>
            <Typography 
              component="p" 
              variant="h4" 
              sx={{ 
                mt: 1, 
                color: balance >= 0 ? 'green' : 'red'
              }}
            >
              ₹{balance.toLocaleString()}
            </Typography>
            <Typography component="p" variant="body2" sx={{ mt: 2 }}>
              as of {new Date().toLocaleDateString()}
            </Typography>
          </Paper>
        </Grid>

        {/* Quick Add with NLP */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Quick Add
            </Typography>
            <form onSubmit={handleQuickAdd}>
              <TextField
                fullWidth
                label="Quick Add (e.g., 'I paid 200 to Swiggy for lunch')"
                value={quickAddText}
                onChange={(e) => setQuickAddText(e.target.value)}
                variant="outlined"
                margin="normal"
                placeholder="Try: 'Recharged Airtel for 399' or 'Received 5000 from freelance work'"
                InputProps={{
                  endAdornment: (
                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="primary"
                      disabled={!quickAddText.trim()}
                      sx={{ ml: 1 }}
                    >
                      Add
                    </Button>
                  )
                }}
              />
            </form>
          </Paper>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Monthly Overview
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={monthlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#4caf50" />
                <Bar dataKey="expenses" name="Expenses" fill="#f44336" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Expense Distribution
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90%' }}>
              {pieChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No expense data available
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Recent Transactions
            </Typography>
            <List>
              {transactions.length > 0 ? (
                transactions.slice(0, 5).map((transaction) => (
                  <React.Fragment key={transaction.id}>
                    <ListItem>
                      <Avatar 
                        sx={{ 
                          bgcolor: transaction.isIncome ? 'success.main' : 'info.main',
                          mr: 2
                        }}
                      >
                        {transaction.isIncome ? <IncomeIcon /> : getCategoryIcon(transaction.category)}
                      </Avatar>
                      <ListItemText
                        primary={transaction.description}
                        secondary={`${transaction.category} • ${transaction.date.toLocaleDateString()}`}
                      />
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 'medium', 
                          color: transaction.isIncome ? 'success.main' : 'error.main',
                          mr: 2
                        }}
                      >
                        {transaction.isIncome ? '+' : '-'}₹{transaction.amount}
                      </Typography>
                      <ListItemSecondaryAction>
                        <IconButton 
                          edge="end" 
                          aria-label="delete"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ p: 2 }}>
                  No transactions found
                </Typography>
              )}
            </List>
            {transactions.length > 5 && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button>View All Transactions</Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Add Expense/Income Button */}
      <Fab 
        color="primary" 
        aria-label="add"
        onClick={handleOpenDialog}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16
        }}
      >
        <AddIcon />
      </Fab>

      {/* Add Expense/Income Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Transaction</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="amount"
                label="Amount"
                type="number"
                value={newExpense.amount}
                onChange={handleInputChange}
                fullWidth
                required
                autoFocus
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="category"
                select
                label="Category"
                value={newExpense.category}
                onChange={handleCategoryChange}
                fullWidth
                required
              >
                {categories.map((option) => (
                  <MenuItem key={option.name} value={option.name}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ mr: 1 }}>{option.icon}</Box>
                      {option.name}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                value={newExpense.description}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={newExpense.date}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Add Transaction
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}