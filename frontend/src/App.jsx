import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import BrowserRouter, Routes, and Route
import LandingPage from './pages/LandingPage';
import SignInSide from "./pages/SigninSide";
import Dashboard from './pages/Dashboard';
import SignupSide from './pages/SignupSide';
import Users from './pages/Users';
import Articles from './pages/Articles';
import Settings from './pages/Settings';
import UserDashboard from './pages/UserDashboard';
import Uarticles from './pages/Uarticles';
import UserSettings from './pages/UserSettings';

function App() {
  return (
    <Router> 
      <Routes>
        <Route path="/" element={<LandingPage />} /> 
        <Route path="/login" element={<SignInSide />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignupSide />} />
        <Route path="/users" element={<Users />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/uDashboard" element={<UserDashboard/>}/>
        <Route path="/uarticles" element={<Uarticles />} />
        <Route path="/usettings" element={<UserSettings />} />
      </Routes>
    </Router>
  );
}

export default App;
