import { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import image from "../assets/image2.jpg"; // Import images from assets folder
import remarkGfm from "remark-gfm"; // Adds support for tables, lists, etc.
import rehypeRaw from "rehype-raw"; // Allows rendering inline HTML inside markdown
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";

const NewsletterList = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/latest-newsletters")
      .then((response) => {
        setNewsletters(response.data.latest_newsletters);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleOpen = (newsletter) => {
    setSelectedNewsletter(newsletter);
  };

  const handleClose = () => {
    setSelectedNewsletter(null);
  };

  if (!newsletters.length) return <CircularProgress />;

  return (
    <Box sx={{ padding: '20px' }}>
      <Grid container spacing={3} justifyContent="center">
        {newsletters.map((newsletter) => (
          <Grid item xs={12} sm={6} md={4} key={newsletter.id}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: "#f9f9f9",
                padding: 2,
                textAlign: "center",
                maxWidth: 345, // Limit card width
                margin: 'auto', // Center the card
              }}
            >
              <img 
                src={image} 
                alt="Description" 
                style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'cover' }} 
              />
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
                  {newsletter.filename.replace(".md", "")}
                </Typography>
                <Button variant="contained" color="primary" onClick={() => handleOpen(newsletter)}>
                  Read More
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal for Full Newsletter */}
      <Dialog open={!!selectedNewsletter} onClose={handleClose} fullWidth maxWidth="md">
        {selectedNewsletter && (
          <>
            <DialogTitle>{selectedNewsletter.filename.replace(".md", "")}</DialogTitle>
            <DialogContent dividers>
              <Box
                sx={{
                  padding: 2,
                  "& h1": { fontSize: "1.8rem", fontWeight: "bold", marginBottom: "10px" },
                  "& h2": { fontSize: "1.5rem", fontWeight: "bold", marginBottom: "8px" },
                  "& h3": { fontSize: "1.3rem", fontWeight: "bold", marginBottom: "6px" },
                  "& p": { marginBottom: "10px", fontSize: "1rem", lineHeight: "1.6" },
                  "& ul": { paddingLeft: "20px", marginBottom: "10px" },
                  "& ol": { paddingLeft: "20px", marginBottom: "10px" },
                  "& li": { marginBottom: "5px" },
                  "& a": { color: "#007BFF", textDecoration: "none", fontWeight: "bold" },
                  "& blockquote": {
                    fontStyle: "italic",
                    backgroundColor: "#f0f0f0",
                    padding: "10px",
                    borderLeft: "4px solid #007BFF",
                    marginBottom: "10px",
                  },
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {selectedNewsletter.content}
                </ReactMarkdown>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
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
