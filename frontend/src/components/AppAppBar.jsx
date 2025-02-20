import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AppAppBar = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <AppBar position="sticky" sx={{ background: "#111", py: 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo with animation */}
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ letterSpacing: 1 }}
          component={motion.div}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          NEWS<span style={{ color: "#FF4D4D" }}>CREW</span>
        </Typography>

        <Box>
          {/* Sign Up Button */}
          <Button
            component={motion.button}
            whileHover={{ scale: 1.1 }}
            sx={{
              mx: 1,
              background: "#FF4D4D",
              color: "#fff",
              borderRadius: "20px",
              px: 3,
              "&:hover": { background: "#D93636" },
            }}
            onClick={() => navigate("/signup")} // Navigate to Signup Page
          >
            SIGN UP
          </Button>

          {/* Login Button */}
          <Button
            component={motion.button}
            whileHover={{ scale: 1.1 }}
            sx={{
              border: "2px solid white",
              borderRadius: "20px",
              color: "white",
              px: 3,
            }}
            onClick={() => navigate("/login")} // Navigate to Login Page
          >
            LOGIN
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppAppBar;
