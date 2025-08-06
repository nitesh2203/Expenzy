import React, { useState } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Box, 
  Container, 
  Card, 
  CardContent, 
  Grid, 
  Typography, 
  Checkbox, 
  FormControlLabel, 
  FormGroup, 
  Select, 
  MenuItem, 
  Button, 
  InputLabel, 
  FormControl,
  Drawer,
  TextField,
  IconButton,
  Chip
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Close as CloseIcon, 
  CloudUpload as CloudUploadIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon 
} from '@mui/icons-material';

function JobSearchApp() {
  // State Management
  const [mode, setMode] = useState('dark');
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    daysAvailable: [],
    timeOfDay: '',
    searchTerm: ''
  });

  // Form State
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    coverLetter: ''
  });

  // Constants
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];
    const jobsData = [
      // === SOFTWARE DEVELOPMENT ===
      { id: 1, title: 'Senior React Developer', company: 'TechInnovate', skills: ['React', 'TypeScript', 'MUI'], salary: '$120,000 - $150,000', timeOfDay: 'Morning', daysAvailable: ['Mon', 'Tue', 'Wed'] },
      { id: 2, title: 'Full Stack Developer', company: 'WebWorks', skills: ['JavaScript', 'Node.js', 'MongoDB'], salary: '$110,000 - $140,000', timeOfDay: 'Night', daysAvailable: ['Tue', 'Thu', 'Sat'] },
      { id: 3, title: 'Backend Developer', company: 'ServerSide', skills: ['Node.js', 'Express', 'PostgreSQL'], salary: '$105,000 - $135,000', timeOfDay: 'Afternoon', daysAvailable: ['Tue', 'Sat'] },
      { id: 4, title: 'Frontend Developer', company: 'PixelPerfect', skills: ['HTML', 'CSS', 'JavaScript'], salary: '$95,000 - $120,000', timeOfDay: 'Morning', daysAvailable: ['Wed', 'Fri'] },
      { id: 5, title: 'Mobile App Developer', company: 'AppFusion', skills: ['Flutter', 'React Native', 'Swift'], salary: '$100,000 - $130,000', timeOfDay: 'Evening', daysAvailable: ['Tue', 'Thu'] },
    
      // === DATA SCIENCE & AI ===
      { id: 6, title: 'Data Scientist', company: 'DataGenius', skills: ['Python', 'Machine Learning', 'Pandas'], salary: '$130,000 - $160,000', timeOfDay: 'Evening', daysAvailable: ['Mon', 'Wed', 'Fri'] },
      { id: 7, title: 'AI Engineer', company: 'DeepLearn', skills: ['TensorFlow', 'PyTorch', 'NLP'], salary: '$135,000 - $165,000', timeOfDay: 'Morning', daysAvailable: ['Tue', 'Thu', 'Sat'] },
      { id: 8, title: 'AI Researcher', company: 'NeuralNet', skills: ['Deep Learning', 'AI Research', 'Mathematics'], salary: '$150,000 - $190,000', timeOfDay: 'Morning', daysAvailable: ['Mon', 'Thu'] },
      { id: 9, title: 'Data Engineer', company: 'BigDataCorp', skills: ['Hadoop', 'Spark', 'Kafka'], salary: '$125,000 - $155,000', timeOfDay: 'Night', daysAvailable: ['Mon', 'Wed'] },
      { id: 10, title: 'Business Analyst', company: 'DataInsights', skills: ['SQL', 'Power BI', 'Tableau'], salary: '$110,000 - $135,000', timeOfDay: 'Evening', daysAvailable: ['Tue', 'Fri'] },
    
      // === DESIGN & UI/UX ===
      { id: 11, title: 'UX Designer', company: 'CreativeMinds', skills: ['Figma', 'UI/UX', 'Design Thinking'], salary: '$90,000 - $110,000', timeOfDay: 'Afternoon', daysAvailable: ['Thu', 'Fri'] },
      { id: 12, title: 'Graphic Designer', company: 'DesignNest', skills: ['Adobe Photoshop', 'Illustrator', 'Canva'], salary: '$70,000 - $95,000', timeOfDay: 'Morning', daysAvailable: ['Mon', 'Wed'] },
      { id: 13, title: 'Product Designer', company: 'VisionaryTech', skills: ['Wireframing', 'Prototyping', 'User Testing'], salary: '$85,000 - $115,000', timeOfDay: 'Night', daysAvailable: ['Tue', 'Thu'] },
      { id: 14, title: 'AR/VR Developer', company: 'ImmersiveTech', skills: ['ARKit', 'VR Development', '3D Modeling'], salary: '$130,000 - $160,000', timeOfDay: 'Night', daysAvailable: ['Tue', 'Fri'] },
      { id: 15, title: 'Game Developer', company: 'GameVerse', skills: ['Unity', 'C#', 'Unreal Engine'], salary: '$120,000 - $150,000', timeOfDay: 'Evening', daysAvailable: ['Mon', 'Thu', 'Sun'] },
    
      // === CLOUD & DEVOPS ===
      { id: 16, title: 'Cloud Engineer', company: 'CloudOps', skills: ['AWS', 'Terraform', 'Kubernetes'], salary: '$125,000 - $155,000', timeOfDay: 'Morning', daysAvailable: ['Mon', 'Thu', 'Sat'] },
      { id: 17, title: 'DevOps Engineer', company: 'DeployEase', skills: ['Docker', 'Jenkins', 'CI/CD'], salary: '$115,000 - $145,000', timeOfDay: 'Night', daysAvailable: ['Mon', 'Thu'] },
      { id: 18, title: 'System Administrator', company: 'SysOps', skills: ['Windows Server', 'Active Directory', 'PowerShell'], salary: '$105,000 - $130,000', timeOfDay: 'Evening', daysAvailable: ['Mon', 'Wed'] },
      { id: 19, title: 'Security Engineer', company: 'CyberGuard', skills: ['Firewalls', 'SIEM', 'Cybersecurity'], salary: '$110,000 - $140,000', timeOfDay: 'Afternoon', daysAvailable: ['Tue', 'Fri'] },
      { id: 20, title: 'Network Engineer', company: 'NetSecure', skills: ['Cisco', 'Firewall', 'Linux'], salary: '$95,000 - $120,000', timeOfDay: 'Afternoon', daysAvailable: ['Tue', 'Thu'] },
    
      // === MANAGEMENT & MARKETING ===
      { id: 21, title: 'Marketing Manager', company: 'BrandBoost', skills: ['SEO', 'Google Ads', 'Content Strategy'], salary: '$95,000 - $120,000', timeOfDay: 'Evening', daysAvailable: ['Wed', 'Fri', 'Sun'] },
      { id: 22, title: 'Product Manager', company: 'InnovateX', skills: ['Agile', 'Scrum', 'JIRA'], salary: '$140,000 - $170,000', timeOfDay: 'Morning', daysAvailable: ['Wed', 'Sat'] },
      { id: 23, title: 'Legal Advisor', company: 'LawTech', skills: ['Contracts', 'Corporate Law', 'Negotiation'], salary: '$150,000 - $180,000', timeOfDay: 'Evening', daysAvailable: ['Tue', 'Thu', 'Sun'] },
      { id: 24, title: 'Supply Chain Manager', company: 'LogiTech', skills: ['SAP', 'Logistics', 'Inventory Management'], salary: '$115,000 - $145,000', timeOfDay: 'Night', daysAvailable: ['Mon', 'Fri'] },
      { id: 25, title: 'Technical Writer', company: 'DocuTech', skills: ['Markdown', 'API Documentation', 'Editing'], salary: '$80,000 - $100,000', timeOfDay: 'Afternoon', daysAvailable: ['Mon', 'Thu', 'Sun'] },
    
      // === EMERGING TECH ===
      { id: 26, title: 'Blockchain Developer', company: 'CryptoTech', skills: ['Solidity', 'Ethereum', 'Web3.js'], salary: '$140,000 - $170,000', timeOfDay: 'Afternoon', daysAvailable: ['Mon', 'Wed', 'Fri'] },
      { id: 27, title: 'Quantum Computing Engineer', company: 'QubitTech', skills: ['Quantum Algorithms', 'Qiskit', 'Mathematical Modeling'], salary: '$160,000 - $200,000', timeOfDay: 'Afternoon', daysAvailable: ['Wed', 'Sat'] },
      { id: 28, title: 'Embedded Systems Engineer', company: 'MicroChips', skills: ['C', 'Firmware', 'IoT'], salary: '$110,000 - $140,000', timeOfDay: 'Morning', daysAvailable: ['Wed', 'Sat'] }
    ];
  
  

  // Theme Configuration
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#8A4FFF' : '#6A11CB',
      },
      background: {
        default: mode === 'dark' 
          ? 'linear-gradient(135deg, #1A1A2E, #16213E)' 
          : 'linear-gradient(135deg, #E5E5FF, #F0E6FF)'
      }
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          body {
            background: ${mode === 'dark' 
              ? 'linear-gradient(135deg, #1A1A2E, #16213E)' 
              : 'linear-gradient(135deg, #E5E5FF, #F0E6FF)'};
            background-attachment: fixed;
            min-height: 100vh;
            transition: background 0.3s ease;
          }
        `
      }
    }
  });

  // Handlers
  const toggleThemeMode = () => {
    setMode(prevMode => prevMode === 'dark' ? 'light' : 'dark');
  };

  const handleDayChange = (day) => {
    setFilters(prev => ({
      ...prev,
      daysAvailable: prev.daysAvailable.includes(day)
        ? prev.daysAvailable.filter(d => d !== day)
        : [...prev.daysAvailable, day]
    }));
  };

  const handleSearch = () => {
    // Search logic is handled by filtering in the render method
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
  };

  const handleApplicationFormChange = (e) => {
    const { name, value } = e.target;
    setApplicationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApply = () => {
    console.log('Application submitted', { 
      job: selectedJob, 
      ...applicationForm 
    });
  };

  // Filter Jobs
  const filteredJobs = jobsData.filter(job => {
    const dayMatch = filters.daysAvailable.length === 0 || 
      filters.daysAvailable.some(day => job.daysAvailable.includes(day));
    
    const timeMatch = !filters.timeOfDay || job.timeOfDay === filters.timeOfDay;
    
    const searchMatch = !filters.searchTerm || 
      job.title.toLowerCase().includes(filters.searchTerm.toLowerCase());

    return dayMatch && timeMatch && searchMatch;
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{
          minHeight: '100vh',
          background: theme.palette.background.default,
          transition: 'background 0.3s ease',
          position: 'relative'
        }}
      >
        {/* Theme Toggle */}
        <IconButton 
          onClick={toggleThemeMode} 
          color="primary" 
          sx={{ 
            position: 'absolute', 
            top: 10, 
            right: 10 
          }}
        >
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Job Search Header */}
          <Card 
            sx={{
              background: mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 3,
              mb: 4
            }}
          >
            <CardContent>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom>
                    Days Available
                  </Typography>
                  <FormGroup row>
                    {days.map(day => (
                      <FormControlLabel
                        key={day}
                        control={
                          <Checkbox
                            checked={filters.daysAvailable.includes(day)}
                            onChange={() => handleDayChange(day)}
                            color="primary"
                          />
                        }
                        label={day}
                      />
                    ))}
                  </FormGroup>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Time of Day</InputLabel>
                    <Select
                      value={filters.timeOfDay}
                      label="Time of Day"
                      onChange={(e) => setFilters(prev => ({
                        ...prev, 
                        timeOfDay: e.target.value
                      }))}
                    >
                      {timeSlots.map(slot => (
                        <MenuItem key={slot} value={slot}>
                          {slot}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Search Jobs</InputLabel>
                    <Select
                      value={filters.searchTerm}
                      label="Search Jobs"
                      onChange={(e) => setFilters(prev => ({
                        ...prev, 
                        searchTerm: e.target.value
                      }))}
                    >
                      <MenuItem value="Software">Software</MenuItem>
                      <MenuItem value="Design">Design</MenuItem>
                      <MenuItem value="Marketing">Marketing</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SearchIcon />}
                    fullWidth
                    onClick={handleSearch}
                    sx={{
                      background: mode === 'dark' 
                        ? 'linear-gradient(45deg, #8A4FFF, #6A11CB)' 
                        : 'linear-gradient(45deg, #9C27B0, #673AB7)',
                      '&:hover': {
                        background: mode === 'dark' 
                          ? 'linear-gradient(45deg, #6A11CB, #8A4FFF)' 
                          : 'linear-gradient(45deg, #673AB7, #9C27B0)'
                      }
                    }}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Job Listings */}
          <Grid container spacing={3}>
            {filteredJobs.map(job => (
              <Grid item xs={12} md={4} key={job.id}>
                <Card 
                  sx={{
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: mode === 'dark' 
                        ? '0 10px 20px rgba(0,0,0,0.3)' 
                        : '0 10px 20px rgba(0,0,0,0.1)'
                    },
                    background: mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">{job.title}</Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {job.company}
                    </Typography>
                    <Grid container spacing={1} sx={{ my: 2 }}>
                      {job.skills.map(skill => (
                        <Grid item key={skill}>
                          <Chip label={skill} size="small" color="primary" variant="outlined" />
                        </Grid>
                      ))}
                    </Grid>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Salary: {job.salary}
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth 
                      sx={{ mt: 2 }}
                      onClick={() => handleJobSelect(job)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Job Detail Sidebar */}
        <Drawer
          anchor="right"
          open={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          sx={{
            '& .MuiDrawer-paper': {
              width: { xs: '100%', sm: '500px' },
              background: mode === 'dark' 
                ? 'linear-gradient(135deg, #1A1A2E, #16213E)' 
                : 'linear-gradient(135deg, #E5E5FF, #F0E6FF)',
              padding: 3
            }
          }}
        >
          {selectedJob && (
            <Box sx={{ position: 'relative', height: '100%' }}>
              <IconButton 
                onClick={() => setSelectedJob(null)} 
                sx={{ 
                  position: 'absolute', 
                  top: 10, 
                  right: 10, 
                  color: mode === 'dark' ? 'white' : 'black' 
                }}
              >
                <CloseIcon />
              </IconButton>

              <Typography variant="h4" gutterBottom>
                {selectedJob.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {selectedJob.company}
              </Typography>

              <Box sx={{ my: 3 }}>
                <Typography variant="h6">Job Description</Typography>
                <Typography variant="body2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                  Sed euismod, nunc vel bibendum lacinia, augue nunc tincidunt 
                  nunc, eget aliquam nunc nunc eu nunc.
                </Typography>
              </Box>

              <Box sx={{ my: 3 }}>
                <Typography variant="h6">Skills Required</Typography>
                <Typography variant="body2">
                  {selectedJob.skills.join(', ')}
                </Typography>
              </Box>

              <Box component="form" sx={{ my: 3 }}>
                <TextField
                  fullWidth
                  name="name"
                  label="Full Name"
                  value={applicationForm.name}
                  onChange={handleApplicationFormChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  value={applicationForm.email}
                  onChange={handleApplicationFormChange}
                  margin="normal"
                />
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  sx={{ my: 2 }}
                >
                  Upload Resume
                  <input type="file" hidden />
                </Button>
                <TextField
                  fullWidth
                  name="coverLetter"
                  label="Cover Letter"
                  multiline
                  rows={4}
                  value={applicationForm.coverLetter}
                  onChange={handleApplicationFormChange}
                  margin="normal"
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleApply}
                  sx={{
                    mt: 2,
                    background: mode === 'dark' 
                      ? 'linear-gradient(45deg, #8A4FFF, #6A11CB)' 
                      : 'linear-gradient(45deg, #9C27B0, #673AB7)',
                    '&:hover': {
                      background: mode === 'dark' 
                        ? 'linear-gradient(45deg, #6A11CB, #8A4FFF)' 
                        : 'linear-gradient(45deg, #673AB7, #9C27B0)'
                    }
                  }}
                >
                  Apply Now
                </Button>
              </Box>
            </Box>
          )}
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}

export default JobSearchApp;