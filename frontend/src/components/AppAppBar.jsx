import { Button, ButtonGroup, AppBar, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function LandingPage() {
  const navigate = useNavigate(); // Initialize navigate function

  // Function to handle login button click
  const handleLoginClick = () => {
    navigate('/login'); // Redirect to Signin page
  };
  const handleSignupClick = () => {
    navigate('/signup'); // Redirect to Signin page
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            NewsCrew
          </Typography>
          <ButtonGroup variant="outlined" color="inherit">
            <Button onClick={handleSignupClick}>Sign Up</Button>
            <Button onClick={handleLoginClick}>Login</Button> {/* Button triggers the redirection */}
          </ButtonGroup>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default LandingPage;
