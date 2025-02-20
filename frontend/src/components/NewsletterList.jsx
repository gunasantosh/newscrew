import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

// Use import.meta.url for correct image paths
const aiImage = new URL("../assets/ai.jpg", import.meta.url).href;
const machineLearningImage = new URL("../assets/machine_learning.jpg", import.meta.url).href;
const andhraPradeshImage = new URL("../assets/andhra_pradesh.jpg", import.meta.url).href;
const nifty50Image = new URL("../assets/nifty.jpg", import.meta.url).href;
const trumpImage = new URL("../assets/trump.jpg", import.meta.url).href;
const worldPoliticsImage = new URL("../assets/world_politics.jpg", import.meta.url).href;
const defaultImage = new URL("../assets/default.jpg", import.meta.url).href;

// Newsletter Images Mapping
const newsletterImages = {
  "Artificial_Intelligence.md": aiImage,
  "Machine_Learning.md": machineLearningImage,
  "Andhra_Pradesh.md": andhraPradeshImage,
  "Nifty_50.md": nifty50Image,
  "Trump.md": trumpImage,
  "World_Politics.md": worldPoliticsImage,
};

// Component: Newsletter List
const NewsletterList = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [loading, setLoading] = useState(true);
  const latestNewsRef = useRef(null);

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/latest-newsletters");
        if (response.data?.latest_newsletters) {
          setNewsletters(response.data.latest_newsletters);
          setTimeout(() => {
            if (latestNewsRef.current) {
              latestNewsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 1000);
        }
      } catch (error) {
        console.error("Error fetching newsletters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletters();
  }, []);

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", my: 4 }} />;

  return (
    <Box
      sx={{
        px: 3,
        textAlign: "center",
        background: "linear-gradient(135deg, #FFEBEE, #FFCDD2)",
        minHeight: "100vh",
        py: 4,
      }}
      ref={latestNewsRef}
    >
      {/* Header */}
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mb: 3, color: "#333" }}
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Latest Newsletters
      </Typography>

      {/* Newsletters Grid */}
      <Grid container spacing={4} justifyContent="center">
        {newsletters.map((newsletter, index) => (
          <Grid item xs={12} sm={6} md={4} key={newsletter.id}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card
                onClick={() => setSelectedNewsletter(newsletter)}
                sx={{
                  cursor: "pointer",
                  boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: "0.3s",
                  backdropFilter: "blur(15px)",
                  background: "rgba(255, 255, 255, 0.2)",
                  "&:hover": {
                    boxShadow: "0px 15px 40px rgba(0, 0, 0, 0.2)",
                    transform: "scale(1.03)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={newsletterImages[newsletter.filename] || defaultImage}
                  sx={{
                    width: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => (e.target.src = defaultImage)}
                />

                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {newsletter.filename.replace(".md", "").replace(/_/g, " ")}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      background: "linear-gradient(45deg, #42A5F5, #64B5F6)",
                      color: "#fff",
                      borderRadius: 2,
                      fontWeight: "bold",
                      "&:hover": {
                        background: "linear-gradient(45deg, #2196F3, #42A5F5)",
                      },
                    }}
                  >
                    Read More
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Newsletter Modal */}
      <Dialog
        open={!!selectedNewsletter}
        onClose={() => setSelectedNewsletter(null)}
        fullWidth
        maxWidth="md"
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "16px",
            background: "#F5F5F5",
            boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        {selectedNewsletter && (
          <>
            {/* Dialog Header */}
            <DialogTitle
              sx={{
                background: "linear-gradient(135deg, #1E2A38, #283747)",
                color: "#FFF",
                textAlign: "center",
                fontWeight: "bold",
                padding: "16px",
                borderRadius: "16px 16px 0 0",
              }}
            >
              {selectedNewsletter.filename.replace(".md", "").replace(/_/g, " ")}
            </DialogTitle>

            {/* Dialog Content */}
            <DialogContent
              sx={{
                padding: "24px",
                background: "rgba(255, 255, 255, 0.98)",
                borderRadius: "0 0 16px 16px",
                maxHeight: "60vh",
                overflowY: "auto",
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {selectedNewsletter.content ? (
                  <ReactMarkdown>{selectedNewsletter.content}</ReactMarkdown>
                ) : (
                  <Box display="flex" justifyContent="center" alignItems="center" minHeight="50px">
                    <CircularProgress size={40} />
                  </Box>
                )}
              </motion.div>
            </DialogContent>

            {/* Dialog Actions */}
            <DialogActions sx={{ justifyContent: "center", background: "#F5F5F5" }}>
              <Button
                onClick={() => setSelectedNewsletter(null)}
                sx={{
                  background: "linear-gradient(135deg, #A64B2A, #8B3E1C)",
                  color: "#fff",
                  fontWeight: "bold",
                  px: 4,
                  borderRadius: "24px",
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default NewsletterList;
