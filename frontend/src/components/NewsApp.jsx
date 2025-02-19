import React, { useState, useEffect } from "react";
import Card from "./Card";
import SignUp from "./SignUp";
import Login from "./Login";
import NewsletterSubscribe from "./NewsletterSubscribe"; // Import NewsletterSubscribe component
import "./index.css";

const Newsapp = () => {
  const [search, setSearch] = useState("india");
  const [newsData, setNewsData] = useState([]);
  const [user, setUser] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const API_KEY = "4b55873d388248279f70d4900fb88e1a";

  const getData = async () => {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${search}&apiKey=${API_KEY}`
      );
      const jsonData = await response.json();
      setNewsData(jsonData.articles || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInput = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    getData();
  }, [search]);

  // Handle user sign up
  const handleSignUp = (email, password) => {
    setUser({ email, password });
    setShowSignUp(false);
    alert("Sign Up Successful!");
    setShowNewsletterModal(true); // Show modal after sign up
  };

  // Handle user login
  const handleLogin = (email, password) => {
    if (user?.email === email && user?.password === password) {
      alert("Login Successful!");
      setShowLogin(false);
      setShowNewsletterModal(true); // Show modal after login
    } else {
      alert("Invalid login credentials");
    }
  };

  // Logout function to clear user data
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div>
      <nav>
        <h1>AI NEWSLETTER</h1>
        <div className="Search">
          <input
            type="text"
            placeholder="Search News Topics"
            onChange={handleInput}
          />
          <button onClick={getData}>Search</button>
        </div>
        <div className="categorybtn">
          <button onClick={() => setSearch("india")}>India</button>
          <button onClick={() => setSearch("technology")}>Technology</button>
          <button onClick={() => setSearch("entertainment")}>Entertainment</button>
          <button onClick={() => setSearch("politics")}>Politics</button>
          <button onClick={() => setSearch("business")}>Business</button>
          <button onClick={() => setSearch("health")}>Health</button>
          <button onClick={() => setSearch("sports")}>Sports</button>
        </div>

        {/* Login or Logout button */}
        <div className="auth-buttons">
          {user ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <button onClick={() => setShowLogin(true)}>Login</button>
          )}
        </div>
      </nav>

      {/* Newsletter Subscribe Banner at the Top */}
      <div className="newsletter-banner">
        <h2>Stay Updated! Subscribe to our Newsletter</h2>
        <NewsletterSubscribe />
      </div>

      {/* Conditionally render SignUp or Login based on user interaction */}
      {showLogin && !showSignUp && (
        <Login onLogin={handleLogin} onShowSignUp={() => setShowSignUp(true)} />
      )}
      {showSignUp && (
        <SignUp onSignUp={handleSignUp} onShowLogin={() => setShowLogin(true)} />
      )}

      <div>
        {/* Display news cards */}
        <Card data={newsData} />
      </div>
    </div>
  );
};

export default Newsapp;
