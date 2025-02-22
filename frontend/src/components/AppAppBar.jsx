import { Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

const AppAppBar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSignup = useCallback(() => navigate("/signup"), [navigate]);
  const handleLogin = useCallback(() => navigate("/login"), [navigate]);
  const toggleDrawer = useCallback(() => setDrawerOpen((prev) => !prev), []);

  return (
    <AppBar position="sticky" sx={{ background: "#111", py: 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Animated Logo */}
        <Typography
          variant={isMobile ? "h6" : "h5"}
          fontWeight="bold"
          sx={{ letterSpacing: 1, cursor: "pointer" }}
          component={motion.div}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.1, color: "#FF4D4D" }}
          onClick={() => navigate("/")}
        >
          NEWS<span style={{ color: "#FF4D4D" }}>CREW</span>
        </Typography>

        {/* Desktop Buttons */}
        {!isMobile ? (
          <Box>
            <Button
              component={motion.button}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              sx={{
                mx: 1,
                background: "#FF4D4D",
                color: "#fff",
                borderRadius: "20px",
                px: 3,
                transition: "all 0.3s",
                "&:hover": { background: "#D93636" },
              }}
              onClick={handleSignup}
              aria-label="Sign Up"
            >
              SIGN UP
            </Button>

            <Button
              component={motion.button}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              sx={{
                border: "2px solid white",
                borderRadius: "20px",
                color: "white",
                px: 3,
                transition: "all 0.3s",
              }}
              onClick={handleLogin}
              aria-label="Login"
            >
              LOGIN
            </Button>
          </Box>
        ) : (
          // Mobile Menu Button
          <IconButton onClick={toggleDrawer} sx={{ color: "white" }}>
            <MenuIcon fontSize="large" />
          </IconButton>
        )}
      </Toolbar>

      {/* Mobile Drawer Menu */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        <List sx={{ width: 250 }}>
          <ListItem disablePadding>
            <ListItemButton onClick={handleSignup}>
              <ListItemText primary="Sign Up" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogin}>
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  );
};

export default AppAppBar;