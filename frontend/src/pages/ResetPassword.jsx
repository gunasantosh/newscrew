import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, Box, Button, Paper, TextField, Typography } from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: { "Content-Type": "application/json" },
});

export default function ResetPassword() {
  const { uid, token } = useParams(); // Get UID and token from URL
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await api.post(`/password-reset-confirm/${uid}/${token}/`, { password: newPassword });
      setMessage("✅ Password successfully reset! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000); // Redirect after success
    } catch (err) {
      setMessage("❌ Invalid or expired token.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#222" }}>
      <Paper sx={{ p: 4, maxWidth: 400, textAlign: "center" }}>
        <LockResetIcon sx={{ fontSize: 50, color: "#FF4D4D" }} />
        <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
          Reset Password
        </Typography>
        <TextField
          fullWidth
          label="New Password"
          type="password"
          variant="outlined"
          sx={{ mt: 3 }}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          variant="outlined"
          sx={{ mt: 2 }}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {message && <Alert severity={message.includes("✅") ? "success" : "error"} sx={{ mt: 2 }}>{message}</Alert>}
        <Button
          fullWidth
          variant="contained"
          sx={{ bgcolor: "#FF4D4D", mt: 3, py: 1.5, borderRadius: "30px", fontWeight: "bold" }}
          onClick={handlePasswordReset}
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </Paper>
    </Box>
  );
}
