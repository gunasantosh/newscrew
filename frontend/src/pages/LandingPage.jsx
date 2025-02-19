import AppAppBar from "../components/AppAppBar"
import Divider from '@mui/material/Divider';
import Hero from "../components/Hero";
import NewsletterList from "../components/NewsLetterList";

function LandingPage() {
  return (
    <>
    <AppAppBar />
    <Divider />
    <Hero />
    <Divider />
    <NewsletterList />
    </>
  )
}

export default LandingPage