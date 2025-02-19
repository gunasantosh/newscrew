import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import BrowserRouter, Routes, and Route
import LandingPage from './pages/LandingPage';
import SignInSide from "./pages/SigninSide";
import Dashboard from './pages/Dashboard';
import SignupSide from './pages/SignupSide';

function App() {
  return (
    <Router> 
      <Routes>
        <Route path="/" element={<LandingPage />} /> 
        <Route path="/login" element={<SignInSide />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignupSide />} />
      </Routes>
    </Router>
  );
}

export default App;
