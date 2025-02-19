import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
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
  Grid,
  Paper,
  Container,
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
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  height: 240,
}));

export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');  // Redirect if no token found
    } else {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1/api/user/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');  // Clear invalid token
        navigate('/login');  // Redirect to login
      }
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
          <Typography variant="h6" noWrap component="div">
            NewsCrew Dashboard
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
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Typography variant="h5">NewsCrew</Typography>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => { navigate(item.path); setOpen(false); }}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Main open={open}>
        <DrawerHeader />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StyledPaper>
                <Typography variant="h4" gutterBottom>
                  Welcome, {userData?.name || 'User'}!
                </Typography>
                <Typography variant="body1">
                  This is your NewsCrew dashboard. You can manage your articles, view statistics, and more.
                </Typography>
              </StyledPaper>
            </Grid>

            <Grid item xs={12} md={4}>
              <StyledPaper>
                <Typography variant="h6">Total Articles</Typography>
                <Typography variant="h3">{userData?.articleCount || 0}</Typography>
              </StyledPaper>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledPaper>
                <Typography variant="h6">Published Articles</Typography>
                <Typography variant="h3">{userData?.publishedArticles || 0}</Typography>
              </StyledPaper>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledPaper>
                <Typography variant="h6">Draft Articles</Typography>
                <Typography variant="h3">{userData?.draftArticles || 0}</Typography>
              </StyledPaper>
            </Grid>
          </Grid>
        </Container>
      </Main>
    </Box>
  );
}
