import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField
} from '@mui/material';
import {
  Menu as MenuIcon, ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon, Article as ArticleIcon,
  Settings as SettingsIcon, Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Color Palette
const colorPalette = {
  primary: "#FF4D4D",
  text: "#fff",
  inputBackground: "#fff",
  gradient: { start: "rgba(0,0,0,0.3)", end: "rgba(0,0,0,0.8)" },
  button: { background: "#FF4D4D", hoverScale: 1.1, borderRadius: "30px" },
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
    backgroundColor: colorPalette.primary,
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
  backgroundColor: colorPalette.primary,
  color: colorPalette.text,
}));

export default function Usettings() {
  const [open, setOpen] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTopic, setCurrentTopic] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserTopic();
  }, []);

  const fetchUserTopic = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://127.0.0.1:8000/api/update_user_topic/', {
        headers: { Authorization: `Token ${token}` }
      });
      setCurrentTopic(response.data.topic);
    } catch (error) {
      console.error("Error fetching topic:", error);
    }
  };

  const handleUpdateTopic = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        'http://127.0.0.1:8000/api/update_user_topic/',
        { topic: newTopic },
        { headers: { Authorization: `Token ${token}` } }
      );
      if (response.status === 200) {
        setCurrentTopic(newTopic);
        setUpdateMessage("Topic updated successfully!");
      }
    } catch (error) {
      console.error("Error updating topic:", error);
      setUpdateMessage("Failed to update topic.");
    }
    setOpenDialog(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <StyledAppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => setOpen(true)} edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">NEWSCREW</Typography>
        </Toolbar>
      </StyledAppBar>
      
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor: colorPalette.gradient.end,
            color: colorPalette.text,
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Typography variant="h5">NEWSCREW</Typography>
          <IconButton onClick={() => setOpen(false)} sx={{ color: colorPalette.text }}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[{ text: 'Dashboard', icon: <DashboardIcon />, path: '/udashboard' },
            { text: 'Articles', icon: <ArticleIcon />, path: '/uarticles' },
            { text: 'Settings', icon: <SettingsIcon />, path: '/usettings' },
            { text: 'Logout', icon: <LogoutIcon />, path: '/login' }]
            .map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => { navigate(item.path); setOpen(false); }}>
                  <ListItemIcon sx={{ color: colorPalette.text }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Drawer>

      <Main open={open}>
        <DrawerHeader />
        <Typography variant="h6">Current Topic: {currentTopic || "Not set"}</Typography>
        <Button variant="contained" sx={{ backgroundColor: colorPalette.button.background }} onClick={() => setOpenDialog(true)}>
          Update Topic
        </Button>
        {updateMessage && <Typography>{updateMessage}</Typography>}

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Update Topic</DialogTitle>
          <DialogContent>
            <TextField fullWidth label="Enter New Topic" variant="outlined" onChange={(e) => setNewTopic(e.target.value)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button sx={{ backgroundColor: colorPalette.button.background }} onClick={handleUpdateTopic} variant="contained">Update</Button>
          </DialogActions>
        </Dialog>
      </Main>
    </Box>
  );
}