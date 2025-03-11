import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import api from "../api";
import { motion } from "framer-motion";
import { useState } from "react";
import heroVideo from "../assets/hero_background.mp4";

const Hero = () => {
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [errors, setErrors] = useState({ email: "", topic: "" });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  const validateEmail = (email) => /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email);
  const validateTopic = (topic) => /^[a-zA-Z0-9 &-]+$/.test(topic);

  const handleSubscribe = async () => {
    let newErrors = { email: "", topic: "" };
    setMessage(null);

    if (!email) newErrors.email = "Email is required.";
    else if (!validateEmail(email)) newErrors.email = "Enter a valid email.";

    if (!topic) newErrors.topic = "Topic is required.";
    else if (!validateTopic(topic)) newErrors.topic = "Only letters, numbers, '&' and '-' are allowed.";

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.topic) {
      try {
        const response = await api.post("api/subscribe/", { email, topic });

        if (response.status === 201) {
          setMessage("Successfully subscribed!");
          setMessageType("success");
          setEmail("");
          setTopic("");
        }
      } catch (error) {
        if (error.response) {
          setMessage(error.response.data.email?.[0] || "Subscription failed.");
        } else {
          setMessage("Something went wrong. Please try again.");
        }
        setMessageType("error");
      }
    }
  };

  return (
    <Box sx={{ position: "relative", height: "80vh", overflow: "hidden" }}>
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Gradient Overlay & Content */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          color: "#fff",
          px: 3,
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          Stay Informed with <span style={{ color: "#FF4D4D" }}>NewsCrew</span>
        </Typography>
        <Typography variant="h6" sx={{ mt: 2, maxWidth: "600px" }}>
          Subscribe to stay updated with the latest news and articles.
        </Typography>

        {message && (
          <Alert severity={messageType} sx={{ mt: 2, width: "50%" }}>
            {message}
          </Alert>
        )}

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mt: 3,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <TextField
            variant="outlined"
            label="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            sx={{
              backgroundColor: "#fff",
              borderRadius: 1,
              width: { xs: "100%", sm: "250px" },
            }}
          />
          <TextField
            variant="outlined"
            label="Enter topic of interest"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            error={!!errors.topic}
            helperText={errors.topic}
            sx={{
              backgroundColor: "#fff",
              borderRadius: 1,
              width: { xs: "100%", sm: "200px" },
            }}
          />
          <Button
            component={motion.button}
            whileHover={{ scale: 1.1 }}
            variant="contained"
            sx={{
              bgcolor: "#FF4D4D",
              px: 4,
              py: 1.5,
              borderRadius: "30px",
              minWidth: "150px",
            }}
            onClick={handleSubscribe}
          >
            Subscribe
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;