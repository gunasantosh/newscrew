import { Box } from "@mui/material";
import AppAppBar from "../components/AppAppBar";
import Hero from "../components/Hero";
import NewsletterList from "../components/NewsletterList";

const LandingPage = () => {
  return (
    <Box>
      <AppAppBar />
      <Hero />
      <NewsletterList />
    </Box>
  );
};

export default LandingPage;
