import LockOutlined from "@mui/icons-material/LockOutlined";
import { Alert, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import api from "../api";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import newscrew1 from "../assets/newscrew1.jpg";



export default function SigninSide() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("api/login/", formData);
      console.log(response.data);
      localStorage.setItem("authToken", response.data.token);
      if (response.data.user.email === "gunasantosh999@gmail.com"){
        navigate("/dashboard");
      } 
      else{
        navigate("/uDashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setResetMessage("");
    setResetLoading(true);
    try {
      await api.post("api/password-reset/", { email: resetEmail });
      setResetMessage("✅ Password reset link sent to your email.");
    } catch (err) {
      setResetMessage("❌ Failed to send reset link. Please check your email.");
      console.error(err);
    } finally {
      setResetLoading(false);
    }
  };

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

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${newscrew1})`,
          backgroundSize: "cover",
          position: "relative",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
          }}
        />
      </Grid>

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
          p: 3,
        }}
      >
        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <Avatar sx={{ m: 1, bgcolor: "#FF4D4D", mx: "auto" }}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            Sign In to <span style={{ color: "#FF4D4D" }}>NewsCrew</span>
          </Typography>
        </motion.div>

        {error && <Alert severity="error" sx={{ mt: 2, width: "100%" }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, textAlign: "center", width: "80%" }}>
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
  />

  

  <Button type="submit" fullWidth variant="contained" sx={{ bgcolor: "#FF4D4D", mt: 2, py: 1.5, borderRadius: "30px", fontWeight: "bold" }} disabled={loading}>
    {loading ? "Signing in..." : "Sign In"}
  </Button>

  {/* Copyright Component Below Button */}
  <Box sx={{ mt: 3 }}>
    <Copyright />
  </Box>
</Box>
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
<Link component="button" variant="body2" sx={{ color: "#FF4D4D", mt: 1 }} onClick={() => setOpenResetDialog(true)}>
    Forgot Password?
  </Link>


        {/* Password Reset Dialog */}
        
      </Grid>
      <Dialog 
          open={openResetDialog} 
          onClose={() => setOpenResetDialog(false)}
          PaperProps={{
            component: motion.div,
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.3 },
            sx: { borderRadius: "20px", padding: "20px" }
          }}
        >
          <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
            <LockOutlined sx={{ fontSize: 40, color: "#FF4D4D" }} /> <br />
            Reset Your Password
          </DialogTitle>

          <DialogContent sx={{ minWidth: "350px" }}>
            <Typography variant="body2" sx={{ textAlign: "center", mb: 2 }}>
              Enter your registered email, and we’ll send you a password reset link.
            </Typography>

            <TextField fullWidth label="Enter your email" variant="outlined" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} sx={{ backgroundColor: "#fff", borderRadius: "10px" }} />

            {resetMessage && <Alert severity={resetMessage.includes("✅") ? "success" : "error"} sx={{ mt: 2 }}>{resetMessage}</Alert>}
          </DialogContent>

          <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2 }}>
            <Button onClick={() => setOpenResetDialog(false)} sx={{ color: "#FF4D4D", fontWeight: "bold" }}>Cancel</Button>
            <Button onClick={handleResetPassword} sx={{ bgcolor: "#FF4D4D", color: "#fff", fontWeight: "bold", px: 3, py: 1, borderRadius: "30px" }} disabled={resetLoading}>
              {resetLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </DialogActions>
        </Dialog>
    </Grid>
  );
}