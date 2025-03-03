import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Drawer,
  AppBar,List,
  Typography,
  IconButton,
  Button,
  TextField,
  Toolbar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Container,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  AutoAwesome as NewsIcon,
  Save as SaveIcon,
  Send as SendIcon,
  Update as LatestNewsIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Article as ArticleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

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


// Axios instance with interceptor for Authorization
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default function Settings() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [topic, setTopic] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [loading, setLoading] = useState(false);
  // Add a message state to show the operation status
  const [statusMessage, setStatusMessage] = useState("");

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

  // Fetch topics when component mounts
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await api.get("fetch-topics/");
        setTopics(response.data.topics || []);
      } catch (error) {
        console.error("Error fetching topics:", error);
        alert("Failed to fetch topics.");
      }
    };

    fetchTopics();
  }, []);

  // Generate News
  const handleGenerateNews = async () => {
    if (!topic.trim()) {
      return alert("Enter a topic first.");
    }
    
    setLoading(true);
    setStatusMessage("Generating news...");
    try {
      await api.post("news-gen/", { topic });
      setStatusMessage("News generated successfully!");
    } catch (error) {
      console.error("Error generating news:", error);
      setStatusMessage("Failed to generate news.");
      alert("Failed to generate news.");
    } finally {
      setLoading(false);
    }
  };

  // Save News to DB
  const handleSaveToDB = async () => {
    setLoading(true);
    setStatusMessage("Saving news to database...");
    try {
      await api.get("upload-newsletters/");
      setStatusMessage("News saved to the database successfully!");
    } catch (error) {
      console.error("Error saving news:", error);
      setStatusMessage("Failed to save news.");
      alert("Failed to save news.");
    } finally {
      setLoading(false);
    }
  };

// Send Latest Newsletter
const handleSendLatestNewsletter = async () => {
  setLoading(true);
  setStatusMessage("Sending latest newsletter...");
  try {
    const response = await api.post("send-latest-newsletter/");
    const sentCount = response.data.sent_count || 0; // Get the number of emails sent
    const message = `Newsletter sent successfully to ${sentCount} subscribers.`;
    
    setStatusMessage(message);
    // alert(message);
  } catch (error) {
    console.error("Error sending newsletter:", error);
    setStatusMessage("Failed to send newsletter.");
    alert("Failed to send newsletter.");
  } finally {
    setLoading(false);
  }
};


  // Send Newsletter for Selected Topic
  const handleSendNewsletterForTopic = async () => {
    if (!selectedTopic) {
      return alert("Please select a topic first.");
    }
    
    if (!window.confirm(`Send newsletter for '${selectedTopic}'?`)) return;

    setLoading(true);
    setStatusMessage(`Sending newsletter for '${selectedTopic}'...`);
    try {
      const response = await api.post("send-newsletter/", { filename: selectedTopic });
      const message = `Newsletter sent for '${selectedTopic}' to:\n${response.data.sent_to?.join("\n") || "No recipients"}`;
      setStatusMessage(message);
      alert(message);
    } catch (error) {
      console.error("Error sending newsletter:", error);
      setStatusMessage("Failed to send newsletter for the selected topic.");
      alert("Failed to send newsletter for the selected topic.");
    } finally {
      setLoading(false);
    }
  };

  // Update News (Prevents duplicate `.md` extension)
  const handleUpdateNews = async () => {
    if (!selectedTopic) {
      return alert("Please select a topic first.");
    }

    const formattedTopic = selectedTopic.replace(/\.md$/, ""); // Ensure no duplicate .md
    
    setLoading(true);
    setStatusMessage(`Updating news for '${formattedTopic}.md'...`);
    try {
      await api.post("news-gen/", { topic: `${formattedTopic}` });
      await api.get("upload-newsletters/");
      const response = await api.post("send-latest-newsletter/", { topic: `${formattedTopic}.md` });
      
      const message = `Updated news sent for ${formattedTopic} to:\n${response.data.sent_to?.join("\n") || "Sent to recipients"}`;
      setStatusMessage(message);
    } catch (error) {
      console.error("Error updating news:", error);
      setStatusMessage("Failed to update news.");
      alert("Failed to update news.");
    } finally {
      setLoading(false);
    }
  };

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
          <Box sx={{ flexGrow: 1, padding: 3 }}>
            {/* Status message display */}
            {statusMessage && (
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 2, 
                  p: 1, 
                  bgcolor: 'info.light', 
                  borderRadius: 1 
                }}
              >
                {statusMessage}
              </Typography>
            )}

            {/* Demo Section */}
            <Typography variant="h6">Demo</Typography>
            <TextField
              fullWidth
              label="Enter Topic"
              variant="outlined"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              sx={{ marginBottom: 2 }}
              disabled={loading}
            />
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<NewsIcon />} 
              onClick={handleGenerateNews} 
              sx={{ marginRight: 1 }}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate News"}
            </Button>
            <Button 
              variant="contained" 
              color="secondary" 
              startIcon={<SaveIcon />} 
              onClick={handleSaveToDB} 
              sx={{ marginRight: 1 }}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save to DB"}
            </Button>
            <Button 
              variant="contained" 
              color="info" 
              startIcon={<SendIcon />} 
              onClick={handleSendLatestNewsletter}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Latest Newsletter"}
            </Button>

            {/* Production Section */}
            <Typography variant="h6" sx={{ mt: 4 }}>Production</Typography>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>Select Topic</InputLabel>
              <Select 
                value={selectedTopic} 
                onChange={(e) => setSelectedTopic(e.target.value)}
                disabled={loading}
              >
                {topics.map((topic, index) => (
                  <MenuItem key={index} value={topic}>{topic}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button 
              variant="contained" 
              color="secondary" 
              startIcon={<SaveIcon />} 
              onClick={handleSaveToDB} 
              sx={{ marginRight: 1 }}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save to DB"}
            </Button>
            <Button 
              variant="contained" 
              color="success" 
              startIcon={<SendIcon />} 
              onClick={handleSendNewsletterForTopic} 
              sx={{ marginRight: 1 }} 
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Newsletter"}
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<LatestNewsIcon />} 
              onClick={handleUpdateNews}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update News"}
            </Button>
          </Box>
        </Container>
      </Main>
    </Box>
  );
}