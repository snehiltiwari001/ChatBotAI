import React, { useState, Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  CssBaseline,
  Container,
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  Fade,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Link,
  Avatar,
  Menu,
  MenuItem,
  InputAdornment,
  Alert,
  Grid,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Send as SendIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  Help as HelpIcon,
  Close as CloseIcon,
  Chat as ChatIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Home as HomeIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  TrendingUp,
  Speed,
  Analytics,
} from '@mui/icons-material';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Route, Routes, Link as RouterLink, Navigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// 3D Email Model Component
function EmailModel({ isSpam }) {
  const meshRef = useRef();
  const particlesRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group>
      {/* Central Shield */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={isSpam ? '#ff4444' : '#44ff44'}
          metalness={0.8}
          roughness={0.2}
          emissive={isSpam ? '#ff0000' : '#00ff00'}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Orbiting Rings */}
      <group ref={particlesRef}>
        {Array.from({ length: 3 }).map((_, i) => (
          <mesh key={i} rotation={[0, 0, (Math.PI / 3) * i]}>
            <torusGeometry args={[1.5, 0.05, 16, 32]} />
            <meshStandardMaterial
              color={isSpam ? '#ff8888' : '#88ff88'}
              emissive={isSpam ? '#ff0000' : '#00ff00'}
              emissiveIntensity={0.2}
            />
          </mesh>
        ))}
      </group>

      {/* Floating Particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(i * 0.5) * 2.5,
            Math.cos(i * 0.5) * 2.5,
            Math.sin(i * 0.3) * 2.5,
          ]}
        >
          <sphereGeometry args={[0.03]} />
          <meshStandardMaterial
            color={isSpam ? '#ffaaaa' : '#aaffaa'}
            emissive={isSpam ? '#ff0000' : '#00ff00'}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Status Text */}
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {isSpam ? 'SPAM' : 'SAFE'}
      </Text>
    </group>
  );
}

// Chatbot Component
function Chatbot({ open, onClose }) {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your spam classification assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      console.log('Sending message to API:', input);
      const response = await axios.post('http://localhost:5000/api/chatbot', {
        message: input,
      });
      console.log('API response:', response.data);
      setMessages([...newMessages, { text: response.data.response, sender: 'bot' }]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages([...newMessages, { 
        text: "I'm sorry, I'm having trouble connecting to the server. Please try again later.", 
        sender: 'bot' 
      }]);
    }
    setLoading(false);
  };

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 380,
        height: 600,
        display: open ? 'flex' : 'none',
        flexDirection: 'column',
        borderRadius: 4,
        overflow: 'hidden',
        zIndex: 1000,
        border: '1px solid rgba(0,0,0,0.05)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      }}
    >
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        p: 2, 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: '0.02em' }}>Spam Assistant</Typography>
        <IconButton color="inherit" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        p: 3,
        bgcolor: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {messages.map((msg, i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              mb: 1,
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 2,
                maxWidth: '80%',
                borderRadius: 3,
                bgcolor: msg.sender === 'user' ? 'primary.main' : 'white',
                color: msg.sender === 'user' ? 'white' : 'text.primary',
                border: '1px solid rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Typography variant="body1" sx={{ lineHeight: 1.5 }}>
                {msg.text}
              </Typography>
            </Paper>
          </Box>
        ))}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>
      
      <Box sx={{ 
        p: 2, 
        bgcolor: 'white', 
        borderTop: '1px solid', 
        borderColor: 'divider',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            size="small"
            variant="outlined"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
          />
          <IconButton 
            color="primary" 
            onClick={sendMessage} 
            disabled={loading || !input.trim()}
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white', 
              '&:hover': { 
                bgcolor: 'primary.dark',
                transform: 'translateY(-2px)',
              },
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
}

// Create a beautiful theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2c3e50',
      light: '#34495e',
      dark: '#1a252f',
    },
    secondary: {
      main: '#e74c3c',
      light: '#ff6b6b',
      dark: '#c0392b',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '2.5rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
          boxShadow: '0 4px 15px rgba(44, 62, 80, 0.2)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            },
          },
        },
      },
    },
  },
});

// Authentication Components
function SignIn({ onClose, onSwitchToSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // In a real app, you would call your authentication API here
      // For demo purposes, we'll simulate a successful login
      setTimeout(() => {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
        setLoading(false);
        onClose();
        window.location.reload(); // Refresh to update auth state
      }, 1000);
    } catch (err) {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400, p: 3 }}>
      <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ fontWeight: 700, color: 'primary.main' }}>
        Sign In
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />
      
      <FormControlLabel
        control={<Checkbox value="remember" color="primary" />}
        label="Remember me"
        sx={{ mb: 2 }}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{ mb: 2, py: 1.5 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
      </Button>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link component="button" variant="body2" onClick={() => onSwitchToSignUp()}>
          Don't have an account? Sign Up
        </Link>
        <Link href="#" variant="body2">
          Forgot password?
        </Link>
      </Box>
    </Box>
  );
}

function SignUp({ onClose, onSwitchToSignIn }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, you would call your registration API here
      // For demo purposes, we'll simulate a successful registration
      setTimeout(() => {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', name);
        setLoading(false);
        onClose();
        window.location.reload(); // Refresh to update auth state
      }, 1000);
    } catch (err) {
      setError('Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400, p: 3 }}>
      <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ fontWeight: 700, color: 'primary.main' }}>
        Sign Up
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Full Name"
        name="name"
        autoComplete="name"
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        type={showPassword ? 'text' : 'password'}
        id="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        sx={{ mb: 2 }}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{ mb: 2, py: 1.5 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
      </Button>
      
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Link component="button" variant="body2" onClick={() => onSwitchToSignIn()}>
          Already have an account? Sign In
        </Link>
      </Box>
    </Box>
  );
}

// Home Page Component
function HomePage() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 6,
          background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h2" 
            gutterBottom 
            align="center" 
            sx={{ 
              mb: 4, 
              color: 'primary.main',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            Welcome to Email Spam Classifier
          </Typography>
        </motion.div>

        <Fade in={true} style={{ transitionDelay: '200ms' }}>
          <Paper 
            elevation={4} 
            sx={{ 
              p: 4, 
              width: '100%', 
              mb: 4,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              About Our Service
            </Typography>
            <Typography variant="body1" paragraph>
              Our Email Spam Classifier uses advanced machine learning algorithms to detect and filter out spam emails from your inbox. 
              Simply paste the content of any email, and our system will analyze it to determine if it's spam or legitimate.
            </Typography>
            <Typography variant="body1" paragraph>
              Features:
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body1">Real-time spam detection</Typography>
              <Typography component="li" variant="body1">High accuracy rate</Typography>
              <Typography component="li" variant="body1">User-friendly interface</Typography>
              <Typography component="li" variant="body1">Detailed analysis of email content</Typography>
            </Box>
            <Button
              variant="contained"
              component={RouterLink}
              to="/classifier"
              fullWidth
              size="large"
              sx={{ 
                mt: 2,
                py: 1.5,
                background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                boxShadow: '0 4px 15px rgba(44, 62, 80, 0.2)',
              }}
            >
              Try the Classifier
            </Button>
          </Paper>
        </Fade>

        <Fade in={true} style={{ transitionDelay: '400ms' }}>
          <Paper 
            elevation={4} 
            sx={{ 
              p: 4, 
              width: '100%', 
              mb: 4,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              How It Works
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mt: 2 }}>
              <Box sx={{ flex: 1, textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                  <EmailIcon />
                </Avatar>
                <Typography variant="h6" gutterBottom>1. Paste Email</Typography>
                <Typography variant="body2">Copy and paste the content of the email you want to analyze</Typography>
              </Box>
              <Box sx={{ flex: 1, textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                  <SecurityIcon />
                </Avatar>
                <Typography variant="h6" gutterBottom>2. Analyze</Typography>
                <Typography variant="body2">Our system analyzes the email content for spam indicators</Typography>
              </Box>
              <Box sx={{ flex: 1, textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                  <HelpIcon />
                </Avatar>
                <Typography variant="h6" gutterBottom>3. Get Results</Typography>
                <Typography variant="body2">Receive detailed analysis and classification of the email</Typography>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Box>
    </Container>
  );
}

// Analytics Dashboard Component
function AnalyticsDashboard({ result }) {
  const spamData = [
    { name: 'Spam Probability', value: result ? (result.spam_probability * 100) : 0 },
    { name: 'Safe Probability', value: result ? ((1 - result.spam_probability) * 100) : 0 },
  ];

  const COLORS = ['#ff4444', '#44ff44'];

  const indicatorData = [
    { name: 'Urgency', value: result ? 85 : 20 },
    { name: 'Links', value: result ? 65 : 30 },
    { name: 'Grammar', value: result ? 45 : 80 },
    { name: 'Formatting', value: result ? 75 : 25 },
  ];

  return (
    <Box sx={{ width: '100%', height: '100%', p: 2 }}>
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'linear-gradient(145deg, #2196F3 0%, #1976D2 100%)',
              color: 'white',
              borderRadius: 4,
            }}
          >
            <TrendingUp sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">Spam Score</Typography>
            <Typography variant="h4">
              {result ? (result.spam_probability * 100).toFixed(1) : 0}%
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'linear-gradient(145deg, #4CAF50 0%, #388E3C 100%)',
              color: 'white',
              borderRadius: 4,
            }}
          >
            <SecurityIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">Security Level</Typography>
            <Typography variant="h4">
              {result ? (result.is_spam ? 'High Risk' : 'Safe') : 'Ready'}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'linear-gradient(145deg, #FF9800 0%, #F57C00 100%)',
              color: 'white',
              borderRadius: 4,
            }}
          >
            <Speed sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">Analysis Time</Typography>
            <Typography variant="h4">0.5s</Typography>
          </Paper>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              height: '300px',
              background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
              borderRadius: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Spam Analysis
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spamData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {spamData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              height: '300px',
              background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
              borderRadius: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Spam Indicators
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={indicatorData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Detailed Analysis */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
              borderRadius: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Detailed Analysis
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Email Characteristics
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <Analytics color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Content Analysis"
                        secondary={result ? "Analyzed for spam patterns and keywords" : "Ready for analysis"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <SecurityIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Security Check"
                        secondary={result ? (result.is_spam ? "High risk indicators detected" : "No security threats found") : "Pending"}
                      />
                    </ListItem>
                  </List>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Recommendations
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <TrendingUp color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Action Required"
                        secondary={result ? (result.is_spam ? "Consider marking as spam" : "Email appears legitimate") : "Analyze email content"}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <SecurityIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Security Level"
                        secondary={result ? (result.is_spam ? "High - Exercise caution" : "Low - Safe to proceed") : "Not analyzed"}
                      />
                    </ListItem>
                  </List>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

// Classifier Page Component
function ClassifierPage() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  const classifyEmail = async () => {
    if (!email.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/classify', {
        email,
      });
      setResult(response.data);
    } catch (error) {
      console.error('Classification error:', error);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          py: 4,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 4,
        }}
      >
        {/* Left Panel - Analytics Dashboard */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            height: '100%',
            background: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)',
            borderRadius: 4,
          }}
        >
          <AnalyticsDashboard result={result} />
        </Paper>

        {/* Right Panel - Input and Results */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
              borderRadius: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Email Content
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Paste your email content here..."
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={classifyEmail}
              disabled={loading || !email.trim()}
              fullWidth
              sx={{
                py: 1.5,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Analyze Email'}
            </Button>
          </Paper>
        </Box>
      </Box>
      <Chatbot open={chatbotOpen} onClose={() => setChatbotOpen(false)} />
    </Container>
  );
}

// Main App Component
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [anchorEl, setAnchorEl] = useState(null);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    const email = localStorage.getItem('userEmail') || '';
    const name = localStorage.getItem('userName') || '';
    
    setIsAuthenticated(auth);
    setUserEmail(email);
    setUserName(name);
  }, []);

  const handleAuthDialogOpen = (mode) => {
    setAuthMode(mode);
    setAuthDialogOpen(true);
  };

  const handleAuthDialogClose = () => {
    setAuthDialogOpen(false);
  };

  const handleSwitchAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setUserEmail('');
    setUserName('');
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">Menu</Typography>
        <IconButton onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        <ListItem button component={RouterLink} to="/">
          <ListItemIcon>
            <HomeIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={RouterLink} to="/classifier">
          <ListItemIcon>
            <EmailIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Email Classifier" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <SecurityIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Spam Detection" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <HelpIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Help & Tips" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar 
          position="static" 
          elevation={0} 
          sx={{ 
            background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: '0.02em' }}>
              Email Spam Classifier
            </Typography>
            
            {isAuthenticated ? (
              <>
                <Button 
                  color="inherit" 
                  startIcon={<ChatIcon />}
                  onClick={() => setChatbotOpen(!chatbotOpen)}
                  sx={{ 
                    borderRadius: 20, 
                    px: 3, 
                    py: 1, 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.2)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                    mr: 2,
                  }}
                >
                  {chatbotOpen ? 'Close Chat' : 'Open Chat'}
                </Button>
                <IconButton
                  onClick={handleProfileMenuOpen}
                  sx={{ 
                    color: 'white',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                    {userName ? userName.charAt(0).toUpperCase() : userEmail.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      borderRadius: 2,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <MenuItem onClick={handleProfileMenuClose} component={RouterLink} to="/profile">
                    <ListItemIcon>
                      <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  color="inherit" 
                  onClick={() => handleAuthDialogOpen('signin')}
                  sx={{ 
                    borderRadius: 20, 
                    px: 3, 
                    py: 1, 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.2)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => handleAuthDialogOpen('signup')}
                  sx={{ 
                    borderRadius: 20, 
                    px: 3, 
                    py: 1, 
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Toolbar>
        </AppBar>

        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          {drawerContent}
        </Drawer>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/classifier" element={<ClassifierPage />} />
          <Route path="/profile" element={
            isAuthenticated ? (
              <Container maxWidth="md">
                <Box sx={{ py: 6 }}>
                  <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
                    <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 700 }}>
                      User Profile
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                      <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: '3rem', mr: 3 }}>
                        {userName ? userName.charAt(0).toUpperCase() : userEmail.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="h5" gutterBottom>
                          {userName || 'User'}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {userEmail}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ mb: 4 }} />
                    <Typography variant="h6" gutterBottom>
                      Account Settings
                    </Typography>
                    <Button variant="outlined" sx={{ mr: 2 }}>
                      Change Password
                    </Button>
                    <Button variant="outlined" color="secondary">
                      Delete Account
                    </Button>
                  </Paper>
                </Box>
              </Container>
            ) : (
              <Navigate to="/" replace />
            )
          } />
        </Routes>

        <Dialog 
          open={authDialogOpen} 
          onClose={handleAuthDialogClose}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
            }
          }}
        >
          {authMode === 'signin' ? (
            <SignIn onClose={handleAuthDialogClose} onSwitchToSignUp={handleSwitchAuthMode} />
          ) : (
            <SignUp onClose={handleAuthDialogClose} onSwitchToSignIn={handleSwitchAuthMode} />
          )}
        </Dialog>

        <Chatbot open={chatbotOpen} onClose={() => setChatbotOpen(false)} />
      </ThemeProvider>
    </Router>
  );
}

export default App; 
