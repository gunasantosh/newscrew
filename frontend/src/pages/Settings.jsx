import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  Button,
  TextField,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  AutoAwesome as NewsIcon,
  Save as SaveIcon,
  Send as SendIcon,
  Update as LatestNewsIcon,
} from "@mui/icons-material";
import axios from "axios";

const drawerWidth = 240;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  backgroundColor: "#f4f4f4",
}));

// Axios instance with interceptor for Authorization
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default function Settings() {
  const [open, setOpen] = useState(true);
  const [topic, setTopic] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Added missing loading state

  // ✅ Fetch topics when component mounts
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await api.get("fetch-topics/");
        setTopics(response.data.topics || []);
      } catch (error) {
        console.error("Error fetching topics:", error);
        alert("Failed to fetch topics.");
      }
    };

    fetchTopics();
  }, []);

  // ✅ Generate News
  const handleGenerateNews = async () => {
    if (!topic.trim()) return alert("Enter a topic first.");
    try {
      await api.post("news-gen/", { topic });
      alert("News generated successfully!");
    } catch (error) {
      console.error("Error generating news:", error);
      alert("Failed to generate news.");
    }
  };

  // ✅ Save News to DB
  const handleSaveToDB = async () => {
    try {
      await api.get("fetch-newsletters/");
      alert("News saved to the database successfully!");
    } catch (error) {
      console.error("Error saving news:", error);
      alert("Failed to save news.");
    }
  };

  // ✅ Send Latest Newsletter
  const handleSendLatestNewsletter = async () => {
    try {
      const response = await api.post("latest-newsletter/");
      alert(`Newsletter sent to:\n${response.data.sent_to?.join("\n") || "No recipients"}`);
    } catch (error) {
      console.error("Error sending newsletter:", error);
      alert("Failed to send newsletter.");
    }
  };

  // ✅ Send Newsletter for Selected Topic
  const handleSendNewsletterForTopic = async () => {
    if (!selectedTopic) return alert("Please select a topic first.");
    if (!window.confirm(`Send newsletter for '${selectedTopic}'?`)) return;

    setLoading(true);
    try {
      const response = await api.post("send-newsletter/", { filename: selectedTopic });
      alert(`Newsletter sent for '${selectedTopic}' to:\n${response.data.sent_to?.join("\n") || "No recipients"}`);
    } catch (error) {
      console.error("Error sending newsletter:", error);
      alert("Failed to send newsletter for the selected topic.");
    }
    setLoading(false);
  };

  // ✅ Update News (Prevents duplicate `.md` extension)
  const handleUpdateNews = async () => {
    if (!selectedTopic) return alert("Please select a topic first.");

    const formattedTopic = selectedTopic.replace(/\.md$/, ""); // Ensure no duplicate .md

    try {
      await api.post("news-gen/", { topic: `${formattedTopic}.md` });
      await api.get("fetch-newsletters/");
      const response = await api.post("latest-newsletter/", { topic: `${formattedTopic}.md` });

      alert(`Updated news sent for ${formattedTopic}.md to:\n${response.data.sent_to?.join("\n") || "No recipients"}`);
    } catch (error) {
      console.error("Error updating news:", error);
      alert("Failed to update news.");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            backgroundColor: "#222",
            color: "#fff",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Typography variant="h6" sx={{ padding: 2 }}>
          NEWS CREW
        </Typography>
        <IconButton onClick={() => setOpen(false)} sx={{ color: "#fff" }}>
          <ChevronLeftIcon />
        </IconButton>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        {/* Demo Section */}
        <StyledPaper>
          <Typography variant="h6">Demo</Typography>
          <TextField
            fullWidth
            label="Enter Topic"
            variant="outlined"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Button variant="contained" color="primary" startIcon={<NewsIcon />} onClick={handleGenerateNews} sx={{ marginRight: 1 }}>
            Generate News
          </Button>
          <Button variant="contained" color="secondary" startIcon={<SaveIcon />} onClick={handleSaveToDB} sx={{ marginRight: 1 }}>
            Save to DB
          </Button>
          <Button variant="contained" color="info" startIcon={<SendIcon />} onClick={handleSendLatestNewsletter}>
            Send Latest Newsletter
          </Button>
        </StyledPaper>

        {/* Production Section */}
        <StyledPaper>
          <Typography variant="h6">Production</Typography>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Select Topic</InputLabel>
            <Select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
              {topics.map((topic, index) => (
                <MenuItem key={index} value={topic}>{topic}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="secondary" startIcon={<SaveIcon />} onClick={handleSaveToDB} sx={{ marginRight: 1 }}>
            Save to DB
          </Button>
          <Button variant="contained" color="success" startIcon={<SendIcon />} onClick={handleSendNewsletterForTopic} sx={{ marginRight: 1 }} disabled={loading}>
            {loading ? "Sending..." : "Send Newsletter"}
          </Button>
          <Button variant="contained" color="primary" startIcon={<LatestNewsIcon />} onClick={handleUpdateNews}>
            Update News
          </Button>
        </StyledPaper>
      </Box>
    </Box>
  );
}
