import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  useTheme
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CategoryIcon from '@mui/icons-material/Category';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data for past transactions
const mockPastTransactions = [
  { week: 1, amount: 2100, category: 'Dining' },
  { week: 1, amount: 3500, category: 'Groceries' },
  { week: 1, amount: 1200, category: 'Entertainment' },
  { week: 2, amount: 1900, category: 'Dining' },
  { week: 2, amount: 3700, category: 'Groceries' },
  { week: 2, amount: 1500, category: 'Entertainment' },
  { week: 3, amount: 2300, category: 'Dining' },
  { week: 3, amount: 3200, category: 'Groceries' },
  { week: 3, amount: 1100, category: 'Entertainment' },
  { week: 4, amount: 2000, category: 'Dining' },
  { week: 4, amount: 3600, category: 'Groceries' },
  { week: 4, amount: 1300, category: 'Entertainment' },
];

// Mock monthly data for the past 6 months
const mockMonthlyData = [
  { month: 'November', totalSpending: 16800 },
  { month: 'December', totalSpending: 19500 },
  { month: 'January', totalSpending: 17200 },
  { month: 'February', totalSpending: 18300 },
  { month: 'March', totalSpending: 16900 },
  { month: 'April', totalSpending: 17800 }
];

// Mock savings history
const mockSavingsHistory = [
  { week: 1, target: 5000, actual: 5200 },
  { week: 2, target: 5000, actual: 5100 },
  { week: 3, target: 5000, actual: 4800 }
];

// Mock spending categories
const categories = ['Dining', 'Groceries', 'Entertainment', 'Transport', 'Shopping', 'Utilities', 'Others'];

// Mock cluster data for visualization
const clusterData = [
  { name: 'Low Spenders', value: 30 },
  { name: 'Moderate Spenders', value: 45 },
  { name: 'High Spenders', value: 25 }
];

// Predefined default transactions data
const defaultTransactions = [
  { amount: 1500, category: 'Dining', week: 4 },
  { amount: 3200, category: 'Groceries', week: 4 },
  { amount: 2000, category: 'Entertainment', week: 4 },
  { amount: 1200, category: 'Transport', week: 4 }
];

// Predefined default monthly spending
const defaultMonthlySpending = {
  Dining: 6000,
  Groceries: 9500,
  Entertainment: 4000,
  Transport: 3200,
  Shopping: 5500,
  Utilities: 3800,
  Others: 2200
};

// COLORS for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

// Implementation of Isolation Forest for anomaly detection
const detectAnomalies = (transactions, threshold = 2) => {
  // Calculate mean and standard deviation of transactions
  const amounts = transactions.map(t => t.amount);
  const mean = amounts.reduce((sum, val) => sum + val, 0) / amounts.length;
  const stdDev = Math.sqrt(
    amounts.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / amounts.length
  );
  
  // Detect anomalies (values more than threshold standard deviations from mean)
  const anomalies = transactions.filter(t => {
    const zScore = Math.abs((t.amount - mean) / stdDev);
    return zScore > threshold;
  });
  
  return anomalies;
};

// Implementation of K-Means clustering for budget recommendation
const getBudgetRecommendation = (monthlySpending) => {
  // Simplified clustering logic (in reality, would use actual k-means algorithm)
  const totalMonthly = Object.values(monthlySpending).reduce((sum, val) => sum + Number(val || 0), 0);
  
  let spenderGroup;
  if (totalMonthly < 15000) {
    spenderGroup = 'low';
  } else if (totalMonthly < 30000) {
    spenderGroup = 'moderate';
  } else {
    spenderGroup = 'high';
  }
  
  // Budget recommendations based on group
  const recommendations = {
    low: {
      Dining: 3000,
      Groceries: 5000,
      Entertainment: 2000,
      Transport: 2000,
      Shopping: 3000,
      Utilities: 2500,
      Others: 1500
    },
    moderate: {
      Dining: 5000,
      Groceries: 7000,
      Entertainment: 4000,
      Transport: 3500,
      Shopping: 5000,
      Utilities: 3500,
      Others: 2500
    },
    high: {
      Dining: 8000,
      Groceries: 10000,
      Entertainment: 7000,
      Transport: 5000,
      Shopping: 8000,
      Utilities: 5000,
      Others: 4000
    }
  };
  
  return {
    group: spenderGroup,
    recommendations: recommendations[spenderGroup]
  };
};

// Implementation of Prophet for time series forecasting
const forecastSpending = (historicalData) => {
  // Simplified forecasting logic (in reality, would use actual Prophet algorithm)
  const values = historicalData.map(item => item.totalSpending);
  const avgChange = values
    .slice(1)
    .map((val, idx) => val - values[idx])
    .reduce((sum, val) => sum + val, 0) / (values.length - 1);
  
  const lastValue = values[values.length - 1];
  const forecast = lastValue + avgChange;
  
  // Generate next 3 months forecast
  const lastMonth = historicalData[historicalData.length - 1].month;
  const nextMonths = ['May', 'June', 'July'];
  
  const forecastData = [
    ...historicalData,
    ...nextMonths.map((month, idx) => ({
      month,
      totalSpending: Math.round(lastValue + avgChange * (idx + 1))
    }))
  ];
  
  return {
    nextMonth: Math.round(forecast),
    forecastData
  };
};

// Implementation of Logistic Regression for gamification prediction
const predictSavingsGoalSuccess = (savingsHistory, currentSpending, savingsTarget) => {
  // Simplified prediction logic (in reality, would use actual logistic regression)
  const totalSpending = Object.values(currentSpending).reduce((sum, val) => sum + Number(val || 0), 0);
  const recentSavingsAdherence = savingsHistory.filter(item => item.actual >= item.target).length / savingsHistory.length;
  
  // Calculate probability of meeting savings goal (simplified)
  const savingsConsistency = recentSavingsAdherence >= 0.7 ? 0.6 : 0.3;
  const spendingFactor = Math.min(1, savingsTarget / (totalSpending * 0.2));
  
  const probability = savingsConsistency * 0.7 + spendingFactor * 0.3;
  
  return {
    probability: probability,
    isLikelyToSucceed: probability > 0.5,
    savingsStreak: savingsHistory.filter(item => item.actual >= item.target).length
  };
};

const FinancialDashboard = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resultsReady, setResultsReady] = useState(false);
  
  // States for user inputs - initialized with predefined data
  const [transactions, setTransactions] = useState([...defaultTransactions]);
  const [monthlySpending, setMonthlySpending] = useState({...defaultMonthlySpending});
  const [savingsTarget, setSavingsTarget] = useState(7000);
  
  // States for algorithm results
  const [anomalies, setAnomalies] = useState([]);
  const [budgetRecommendation, setBudgetRecommendation] = useState(null);
  const [spendingForecast, setSpendingForecast] = useState(null);
  const [savingsPrediction, setSavingsPrediction] = useState(null);
  
  // Process the predefined data on component mount to show results immediately
  useEffect(() => {
    processData(true);
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  const handleTransactionChange = (index, field, value) => {
    const updatedTransactions = [...transactions];
    updatedTransactions[index][field] = field === 'amount' ? Number(value) || '' : value;
    setTransactions(updatedTransactions);
  };
  
  const addTransaction = () => {
    const lastTransaction = transactions[transactions.length - 1];
    setTransactions([...transactions, {
      amount: '',
      category: 'Dining',
      week: lastTransaction.week
    }]);
  };
  
  const removeTransaction = (index) => {
    if (transactions.length > 1) {
      const updatedTransactions = [...transactions];
      updatedTransactions.splice(index, 1);
      setTransactions(updatedTransactions);
    }
  };
  
  const handleMonthlySpendingChange = (category, value) => {
    setMonthlySpending(prev => ({
      ...prev,
      [category]: value
    }));
  };
  
  const processData = (skipLoading = false) => {
    if (!skipLoading) {
      setLoading(true);
    }
    
    // Process function for both initial load and user-triggered analysis
    const runAnalysis = () => {
      // Run all algorithms
      const validTransactions = transactions.filter(t => t.amount && t.category);
      const allTransactions = [...mockPastTransactions, ...validTransactions];
      
      // 1. Isolation Forest - Anomaly Detection
      const detectedAnomalies = detectAnomalies(allTransactions);
      setAnomalies(detectedAnomalies);
      
      // 2. K-Means Clustering - Budget Recommendation
      const budgetRec = getBudgetRecommendation(monthlySpending);
      setBudgetRecommendation(budgetRec);
      
      // 3. Prophet - Time Series Forecasting
      const forecast = forecastSpending(mockMonthlyData);
      setSpendingForecast(forecast);
      
      // 4. Logistic Regression - Gamification Prediction
      const prediction = predictSavingsGoalSuccess(mockSavingsHistory, monthlySpending, savingsTarget);
      setSavingsPrediction(prediction);
      
      if (!skipLoading) {
        setLoading(false);
      }
      setResultsReady(true);
    };
    
    if (skipLoading) {
      runAnalysis();
    } else {
      // Simulate processing time
      setTimeout(runAnalysis, 1500);
    }
  };
  
  const resetToDefaultData = () => {
    setTransactions([...defaultTransactions]);
    setMonthlySpending({...defaultMonthlySpending});
    setSavingsTarget(7000);
    processData(true);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography 
        variant="h3" 
        component="h1" 
        align="center" 
        gutterBottom
        fontWeight="bold"
        sx={{ mb: 4 }}
      >
        Financial Reports Dashboard
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Enter Data" />
          <Tab label="View Reports" disabled={!resultsReady} />
        </Tabs>
        
        {currentTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" gutterBottom>
                Your Financial Data
              </Typography>
              <Button 
                variant="outlined" 
                color="secondary" 
                size="small"
                onClick={resetToDefaultData}
              >
                Reset to Default Data
              </Button>
            </Box>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Recent Transactions
                </Typography>
                <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
                  {transactions.map((transaction, index) => (
                    <Box key={index} sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                      <TextField
                        label="Amount (₹)"
                        type="number"
                        value={transaction.amount}
                        onChange={(e) => handleTransactionChange(index, 'amount', e.target.value)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                        fullWidth
                      />
                      <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                          value={transaction.category}
                          label="Category"
                          onChange={(e) => handleTransactionChange(index, 'category', e.target.value)}
                        >
                          {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                              {category}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl sx={{ width: '30%' }}>
                        <InputLabel>Week</InputLabel>
                        <Select
                          value={transaction.week}
                          label="Week"
                          onChange={(e) => handleTransactionChange(index, 'week', e.target.value)}
                        >
                          {[1, 2, 3, 4].map((week) => (
                            <MenuItem key={week} value={week}>
                              Week {week}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button 
                        color="error" 
                        onClick={() => removeTransaction(index)}
                        disabled={transactions.length <= 1}
                        sx={{ minWidth: 'auto', p: 1 }}
                      >
                        <DeleteOutlineIcon />
                      </Button>
                    </Box>
                  ))}
                  <Button 
                    startIcon={<AddCircleOutlineIcon />} 
                    onClick={addTransaction}
                    variant="outlined" 
                    sx={{ mt: 1 }}
                  >
                    Add Transaction
                  </Button>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Monthly Spending By Category
                </Typography>
                <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
                  <Grid container spacing={2}>
                    {categories.map((category) => (
                      <Grid item xs={12} sm={6} key={category}>
                        <TextField
                          label={`${category} (₹)`}
                          type="number"
                          value={monthlySpending[category]}
                          onChange={(e) => handleMonthlySpendingChange(category, e.target.value)}
                          InputProps={{
                            startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                          }}
                          fullWidth
                          margin="normal"
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Card>
                
                <Typography variant="h6" gutterBottom>
                  Savings Target
                </Typography>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ width: '100%', px: 2 }}>
                    <Typography id="savings-target-slider" gutterBottom>
                      Monthly Savings Target: ₹{savingsTarget.toLocaleString()}
                    </Typography>
                    <Slider
                      value={savingsTarget}
                      onChange={(e, newValue) => setSavingsTarget(newValue)}
                      aria-labelledby="savings-target-slider"
                      valueLabelDisplay="auto"
                      min={1000}
                      max={20000}
                      step={500}
                      marks={[
                        { value: 1000, label: '₹1K' },
                        { value: 10000, label: '₹10K' },
                        { value: 20000, label: '₹20K' }
                      ]}
                    />
                  </Box>
                </Card>
              </Grid>
              
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  onClick={() => processData()}
                  disabled={loading}
                  sx={{ minWidth: 200 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Update Financial Insights'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {currentTab === 1 && resultsReady && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Your Financial Insights Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Based on your transactions and spending patterns, here are personalized financial insights and recommendations.
              </Typography>
            </Box>
            
            <Grid container spacing={4}>
              {/* Anomaly Detection Results */}
              <Grid item xs={12} md={6}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    height: '100%',
                    borderTop: `4px solid ${theme.palette.error.main}`
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <TrendingUpIcon sx={{ mr: 2, color: theme.palette.error.main }} fontSize="large" />
                      <Typography variant="h5" component="h2" fontWeight="bold">
                        Anomaly Detection
                      </Typography>
                    </Box>
                    
                    {anomalies.length > 0 ? (
                      <>
                        <Alert severity="warning" sx={{ mb: 2 }}>
                          We've detected unusual spending patterns in your recent transactions.
                        </Alert>
                        {anomalies.map((anomaly, index) => (
                          <Typography variant="body1" key={index} paragraph>
                            Transaction of ₹{anomaly.amount.toLocaleString()} in category '{anomaly.category}' is unusually high compared to your past spending.
                          </Typography>
                        ))}
                      </>
                    ) : (
                      <Alert severity="success">
                        No unusual spending patterns detected in your recent transactions.
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Budget Recommendation Results */}
              <Grid item xs={12} md={6}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    height: '100%',
                    borderTop: `4px solid ${theme.palette.primary.main}`
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <CategoryIcon sx={{ mr: 2, color: theme.palette.primary.main }} fontSize="large" />
                      <Typography variant="h5" component="h2" fontWeight="bold">
                        Budget Recommendation
                      </Typography>
                    </Box>
                    
                    {budgetRecommendation && (
                      <>
                        <Typography variant="body1" paragraph>
                          Based on your spending behavior, you belong to the <strong>
                            {budgetRecommendation.group === 'low' ? 'low' : 
                             budgetRecommendation.group === 'moderate' ? 'moderate' : 'high'} spender
                          </strong> group.
                        </Typography>
                        
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                          Recommended Monthly Budget Caps:
                        </Typography>
                        
                        <Grid container spacing={2}>
                          {Object.entries(budgetRecommendation.recommendations).map(([category, amount]) => (
                            <Grid item xs={6} key={category}>
                              <Typography variant="body2">
                                {category}: ₹{amount.toLocaleString()}
                              </Typography>
                            </Grid>
                          ))}
                        </Grid>
                        
                        <Box sx={{ mt: 3, height: 250 }}>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Spending Group Distribution
                          </Typography>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={clusterData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {clusterData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Time Series Forecasting Results */}
              <Grid item xs={12} md={6}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    height: '100%',
                    borderTop: `4px solid ${theme.palette.success.main}`
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <ShowChartIcon sx={{ mr: 2, color: theme.palette.success.main }} fontSize="large" />
                      <Typography variant="h5" component="h2" fontWeight="bold">
                        Spending Forecast
                      </Typography>
                    </Box>
                    
                    {spendingForecast && (
                      <>
                        <Alert severity="info" sx={{ mb: 3 }}>
                          Based on your past spending, your estimated expenses for the next month are ₹{spendingForecast.nextMonth.toLocaleString()}.
                        </Alert>
                        
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                          6-Month Spending Trend with 3-Month Forecast
                        </Typography>
                        
                        <Box sx={{ width: '100%', height: 300 }}>
                          <ResponsiveContainer>
                            <LineChart
                              data={spendingForecast.forecastData}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                              <Legend />
                              <Line 
                                type="monotone" 
                                dataKey="totalSpending" 
                                name="Monthly Spending"
                                stroke={theme.palette.success.main} 
                                activeDot={{ r: 8 }} 
                                strokeWidth={2}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Gamification Prediction Results */}
              <Grid item xs={12} md={6}>
                <Card 
                  elevation={3} 
                  sx={{ 
                    height: '100%',
                    borderTop: `4px solid ${theme.palette.warning.main}`
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <EmojiEventsIcon sx={{ mr: 2, color: theme.palette.warning.main }} fontSize="large" />
                      <Typography variant="h5" component="h2" fontWeight="bold">
                        Savings Goal Prediction
                      </Typography>
                    </Box>
                    
                    {savingsPrediction && (
                      <>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="body1" gutterBottom>
                            Current Savings Streak: <strong>{savingsPrediction.savingsStreak} weeks</strong>
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            Probability of Meeting Your Savings Goal: <strong>{Math.round(savingsPrediction.probability * 100)}%</strong>
                          </Typography>
                        </Box>
                        
                        {savingsPrediction.isLikelyToSucceed ? (
                          <Alert severity="success" sx={{ mb: 2 }}>
                            You're on track to meet your savings goal of ₹{savingsTarget.toLocaleString()} this month!
                          </Alert>
                        ) : (
                          <Alert severity="warning" sx={{ mb: 2 }}>
                            You're at risk of breaking your {savingsPrediction.savingsStreak}-week savings streak. Try limiting your weekend expenses to stay on track.
                          </Alert>
                        )}
                        
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 3 }}>
                          Recent Savings Performance
                        </Typography>
                        
                        <Box sx={{ width: '100%', height: 250 }}>
                          <ResponsiveContainer>
                            <BarChart
                              data={mockSavingsHistory}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="week" label={{ value: 'Week', position: 'insideBottom', offset: -5 }} />
                              <YAxis />
                              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                              <Legend />
                              <Bar dataKey="target" name="Target" fill="#8884d8" />
                              <Bar dataKey="actual" name="Actual Savings" fill="#82ca9d" />
                            </BarChart>
                          </ResponsiveContainer>
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default FinancialDashboard;