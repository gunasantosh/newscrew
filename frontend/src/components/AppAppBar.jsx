import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import NewspaperIcon from "@mui/icons-material/Newspaper";

function AppAppBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="logo"
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <NewspaperIcon />
        </IconButton>
        <Typography
          variant="h6"
          component={"div"}
          sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
        >
          NewsCrew
        </Typography>
        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
          <Button color="inherit">Sign Up</Button>
          <Button color="inherit">Login</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default AppAppBar;
