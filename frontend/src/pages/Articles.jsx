
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Container,
  Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,Button, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Article as ArticleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Extracted Color Palette
const colorPalette = {
  primary: "#FF4D4D", // Primary accent color
  text: "#fff", // White text
  inputBackground: "#fff", // White background for input fields
  gradient: {
    start: "rgba(0,0,0,0.3)", // Gradient start (30% opacity black)
    end: "rgba(0,0,0,0.8)", // Gradient end (80% opacity black)
  },
  button: {
    background: "#FF4D4D", // Button background
    hoverScale: 1.1, // Button hover animation scale
    borderRadius: "30px", // Button border radius
  },
  borderRadius: {
    input: 1, // Input field border radius
  },
};

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const StyledAppBar = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
    backgroundColor: colorPalette.primary, // Apply primary color to AppBar
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
  backgroundColor: colorPalette.primary, // Apply primary color to DrawerHeader
  color: colorPalette.text, // Apply white text color
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  height: 500,
  backgroundColor: colorPalette.gradient.end, // Apply gradient end color to Paper
  color: colorPalette.text, // Apply white text color
}));



export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    total_newsletters: 0,
    total_subscriptions: 0,
    all_users: [],
    all_subscriptions: [],
    articles:[]
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://127.0.0.1:8000/api/dashboard/', {
        headers: { Authorization: `Token ${token}` }
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://127.0.0.1/api/user/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleViewArticle = (article) => {
    setSelectedArticle(article);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedArticle(null);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Users', icon: <PeopleIcon />, path: '/users' },
    { text: 'Articles', icon: <ArticleIcon />, path: '/articles' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledAppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          {/* Updated Heading with Color Styling */}
          <Typography variant="h6" noWrap component="div">
            <span style={{ color: colorPalette.text }}>NEWS</span>
            <span style={{ color: colorPalette.text }}>CREW</span>
          </Typography>
        </Toolbar>
      </StyledAppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: colorPalette.gradient.end, // Apply gradient end color to Drawer
            color: colorPalette.text, // Apply white text color
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          {/* Updated Heading with Color Styling */}
          <Typography variant="h5">
            <span style={{ color: colorPalette.text }}>NEWS</span>
            <span style={{ color: colorPalette.text }}>CREW</span>
          </Typography>
          <IconButton onClick={handleDrawerClose} sx={{ color: colorPalette.text }}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                onClick={() => { navigate(item.path); setOpen(false); }}
                sx={{ color: colorPalette.text }} // Apply white text color
              >
                <ListItemIcon sx={{ color: colorPalette.text }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout} sx={{ color: colorPalette.text }}>
              <ListItemIcon sx={{ color: colorPalette.text }}><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Main open={open}>
        <DrawerHeader />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <StyledPaper>
        <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Filename</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dashboardData.articles.map((article, index) => (
              <TableRow key={index}>
                <TableCell>{article.filename}</TableCell>
                <TableCell>{new Date(article.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleViewArticle(article)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </StyledPaper>

      {/* Dialog for Viewing Article Content */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{selectedArticle?.filename}</DialogTitle>
        <DialogContent>
          <ReactMarkdown>{selectedArticle?.content}</ReactMarkdown>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
        </Container>
      </Main>
    </Box>
  );
}