import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { useState } from "react";
import axios from "axios";

function Hero() {
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [errors, setErrors] = useState({ email: "", topic: "" });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success"); // "success" or "error"

  const validateEmail = (email) => {
    return /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const validateTopic = (topic) => {
    return /^[a-zA-Z ]+$/.test(topic);
  };

  const handleSubscribe = async () => {
    let newErrors = { email: "", topic: "" };
    setMessage(null);

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!topic) {
      newErrors.topic = "Topic is required";
    } else if (!validateTopic(topic)) {
      newErrors.topic = "Topic should contain only letters and spaces";
    }

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.topic) {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/subscribe/", {
          email,
          topic
        });

        if (response.status === 201) {
          setMessage("Successfully subscribed!");
          setMessageType("success");
          setEmail("");
          setTopic("");
        }
      } catch (error) {
        if (error.response) {
          setMessage(error.response.data.message || "Subscription failed.");
          setMessageType("error");
        } else {
          setMessage("Something went wrong. Please try again.");
          setMessageType("error");
        }
      }
    }
  };

  return (
    <Box 
      sx={{ 
        backgroundColor: "#f5f5f5", 
        minHeight: "40vh", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        justifyContent: "center", 
        textAlign: "center", 
        gap: 2,
        padding: 3
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        Subscribe to our Newsletter!
      </Typography>

      {message && (
        <Alert severity={messageType} sx={{ width: "50%" }}>
          {message}
        </Alert>
      )}

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
        <TextField 
          label="Enter your email" 
          variant="outlined" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          error={!!errors.email}
          helperText={errors.email}
          sx={{ width: "250px" }}
        />
        <TextField 
          label="Enter topic of interest" 
          variant="outlined" 
          value={topic} 
          onChange={(e) => setTopic(e.target.value)} 
          error={!!errors.topic}
          helperText={errors.topic}
          sx={{ width: "250px" }}
        />
        <Button variant="contained" color="primary" sx={{ height: "56px" }} onClick={handleSubscribe}>
          Subscribe
        </Button>
      </Box>
    </Box>
  );
}

export default Hero;
