import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlined from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert } from "@mui/material";
import { motion } from "framer-motion";
import newscrew1 from "../assets/newscrew1.jpg";

// Axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const Copyright = () => (
  <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)", textAlign: "center" }}>
    {"Copyright © "}
    <Link color="inherit" href="http://localhost:5173/">
      NewsCrew
    </Link>{" "}
    {new Date().getFullYear()}
    {"."}
  </Typography>
);



export default function SigninSide() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/login/", formData);
      localStorage.setItem("authToken", response.data.token);
      if (formData.username === "sriram"){
        navigate("/dashboard");
      }
      else {
        navigate("/udashboard");
      }
      
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />

      {/* Left Side Background */}
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${newscrew1})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)",
          }}
        />
      </Grid>

      {/* Right Side Form */}
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        square
        sx={{
          backgroundColor: "#222",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "80%", maxWidth: "400px", textAlign: "center" }}>
          <Avatar sx={{ m: 1, bgcolor: "#FF4D4D", mx: "auto" }}>
            <LockOutlined />
          </Avatar>

          <Typography variant="h5" fontWeight="bold">
            Sign In to <span style={{ color: "#FF4D4D" }}>NewsCrew</span>
          </Typography>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, textAlign: "center" }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleInputChange}
              disabled={loading}
              sx={{
                backgroundColor: "#fff",
                borderRadius: "5px",
                "& .MuiOutlinedInput-root": { borderRadius: "10px" },
              }}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
              sx={{
                backgroundColor: "#fff",
                borderRadius: "5px",
                "& .MuiOutlinedInput-root": { borderRadius: "10px" },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                bgcolor: "#FF4D4D",
                color: "#fff",
                mt: 2,
                py: 1.5,
                borderRadius: "30px",
                fontWeight: "bold",
                "&:hover": { bgcolor: "#D93636" },
              }}
              component={motion.button}
              whileHover={{ scale: 1.1 }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <Grid item>
                <Link href="/signup" variant="body2" sx={{ color: "#FF4D4D" }}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>

            {/* Copyright Text */}
            <Box sx={{ mt: 4 }}>
              <Copyright />
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
