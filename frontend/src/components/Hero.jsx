import { Box, Typography, TextField, Button } from "@mui/material";
import heroVideo from "../assets/hero_background.mp4";
import { motion } from "framer-motion";

const Hero = () => {
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

      {/* Gradient Overlay */}
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

        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <TextField
            variant="outlined"
            label="Email"
            sx={{ backgroundColor: "#fff", borderRadius: 1, width: "250px" }}
          />
          <TextField
            variant="outlined"
            label="Topic"
            sx={{ backgroundColor: "#fff", borderRadius: 1, width: "200px" }}
          />
          <Button
            component={motion.button}
            whileHover={{ scale: 1.1 }}
            variant="contained"
            sx={{ bgcolor: "#FF4D4D", px: 4, py: 1.5, borderRadius: "30px" }}
          >
            Subscribe
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;
