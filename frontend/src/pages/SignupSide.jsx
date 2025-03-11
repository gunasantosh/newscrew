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
import api from "../api";
import { Alert } from "@mui/material";
import { motion } from "framer-motion";
import newscrew from "../assets/newscrew.jpg";


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

export default function SignupSide() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("api/signup/", formData);
      localStorage.setItem("authToken", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err.response?.data?.email
        ? err.response.data.email[0]
        : err.response?.data?.username
        ? err.response.data.username[0]
        : "An error occurred during sign-up. Please try again.";
      setError(errorMessage);
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
          backgroundImage: `url(${newscrew})`,
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
            Sign Up to <span style={{ color: "#FF4D4D" }}>NewsCrew</span>
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              {error}
            </Alert>
          )}

          {/* Signup Form */}
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
  sx={{ backgroundColor: "#fff", borderRadius: "10px" }}
  InputLabelProps={{ shrink: !!formData.username }}  // 👈 This hides the placeholder when typing
/>

<TextField
  variant="outlined"
  margin="normal"
  required
  fullWidth
  id="email"
  label="Email"
  name="email"
  autoComplete="email"
  value={formData.email}
  onChange={handleInputChange}
  disabled={loading}
  sx={{ backgroundColor: "#fff", borderRadius: "10px" }}
  InputLabelProps={{ shrink: !!formData.email }}  // 👈 This hides the placeholder when typing
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
  sx={{ backgroundColor: "#fff", borderRadius: "10px" }}
  InputLabelProps={{ shrink: !!formData.password }}  // 👈 This hides the placeholder when typing
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
              {loading ? "Signing up..." : "Sign Up"}
            </Button>

            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <Grid item>
                <Link href="/login" variant="body2" sx={{ color: "#FF4D4D" }}>
                  Already have an account? Sign In
                </Link>
              </Grid>
            </Grid>

            {/* "Go to Home" Link as an Unordered List */}
            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                <li>
                  <Link
                    component="button"
                    variant="body2"
                    sx={{
                      color: "#FF4D4D",
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/")}
                  >
                    Go to Home
                  </Link>
                </li>
              </ul>
            </Grid>

            <Box mt={3}>
              <Copyright />
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
